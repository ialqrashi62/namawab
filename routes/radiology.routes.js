const crypto = require('crypto');
const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeRadiologyRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, sendDoctorSMS, sendRadiologyResultNotification, resultLoop, ce, upload, isOptionalReadSchemaError, optionalReadFallback, RAD_MWL_ENABLED, RAD_WORKLIST_NEXT, RAD_WORKLIST_STATES }) {
    const router = express.Router();
router.get('/api/radiology/orders', requireAuth, async (req, res) => {

    try {

        // --- TENANT SCOPE: filter radiology orders by current tenant_id ---

        const { tenantId } = getRequestTenantContext(req);

        let rows;

        if (tenantId) {

            rows = (await pool.query(`SELECT lo.*, p.name_en as patient_name FROM lab_radiology_orders lo

                LEFT JOIN patients p ON lo.patient_id=p.id

                WHERE lo.is_radiology=1 AND lo.tenant_id=$1 ORDER BY lo.id DESC`, [tenantId])).rows;

        } else {

            rows = (await pool.query('SELECT lo.*, p.name_en as patient_name FROM lab_radiology_orders lo LEFT JOIN patients p ON lo.patient_id=p.id WHERE lo.is_radiology=1 ORDER BY lo.id DESC')).rows;

        }

        res.json(rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/radiology/catalog', requireAuth, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const sql = `

            SELECT

                rc.id,

                rc.modality,

                rc.exact_name,

                COALESCE(o.custom_template, rc.default_template) AS default_template,

                COALESCE(o.custom_price, rc.price) AS price,

                COALESCE(o.is_active, 1) AS is_active

            FROM radiology_catalog rc

            LEFT JOIN tenant_radiology_overrides o ON rc.id = o.radiology_id AND o.tenant_id = $1

            ORDER BY rc.id

        `;

        res.json((await pool.query(sql, [tenantId || null])).rows);

    }

    catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/radiology/orders/:id', requireAuth, async (req, res) => {

    try {

        const { status, result: testResult } = req.body;

        // --- TENANT SCOPE: verify order belongs to current tenant before update (IDOR prevention) ---

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const orderCheck = (await pool.query(`SELECT id FROM lab_radiology_orders WHERE id=$1 AND is_radiology=1${tenantCheck}`, tenantParams)).rows[0];

        if (!orderCheck) return res.status(404).json({ error: 'Radiology order not found' });

        if (status) await pool.query('UPDATE lab_radiology_orders SET status=$1 WHERE id=$2', [status, req.params.id]);

        if (testResult) await pool.query('UPDATE lab_radiology_orders SET results=$1 WHERE id=$2', [testResult, req.params.id]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'UPDATE_RADIOLOGY_ORDER', 'Radiology',

            `Updated radiology order #${req.params.id} status:${status || '-'}`, req.ip);

        res.json((await pool.query('SELECT * FROM lab_radiology_orders WHERE id=$1', [req.params.id])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/radiology/orders', requireAuth, async (req, res) => {

    try {

        const { patient_id, doctor_id, order_type, description, price } = req.body;

        // --- TENANT SCOPE: stamp tenant_id from session + validate patient belongs to same tenant ---

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (tenantId && patient_id) {

            const patientCheck = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

            if (!patientCheck) return res.status(404).json({ error: 'Patient not found' });

        }

        // Auto-lookup price from radiology catalog (with tenant overrides) if not provided

        let radPrice = parseFloat(price) || 0;

        if (!radPrice && order_type) {

            const catalogMatch = (await pool.query(`

                SELECT COALESCE(o.custom_price, rc.price) AS price

                FROM radiology_catalog rc

                LEFT JOIN tenant_radiology_overrides o ON rc.id = o.radiology_id AND o.tenant_id = $2

                WHERE rc.exact_name ILIKE $1 LIMIT 1

            `, [`%${order_type}%`, tenantId || null])).rows[0];

            if (catalogMatch) radPrice = catalogMatch.price;

        }

        const result = await pool.query('INSERT INTO lab_radiology_orders (patient_id, doctor_id, order_type, description, is_radiology, price, tenant_id, facility_id) VALUES ($1,$2,$3,$4,1,$5,$6,$7) RETURNING id',

            [patient_id, doctor_id || 0, order_type || '', description || '', radPrice, tenantId || null, facilityId || null]);

        // Auto-create invoice for radiology (with VAT for non-Saudis)

        if (radPrice > 0 && patient_id) {

            const p = (await pool.query('SELECT name_en, name_ar FROM patients WHERE id=$1', [patient_id])).rows[0];

            const vat = await calcVAT(patient_id);

            const { total: finalTotal, vatAmount } = addVAT(radPrice, vat.rate);

            const desc = `أشعة: ${order_type}` + (vat.applyVAT ? ` (+ ضريبة ${vatAmount} SAR)` : '');

            await pool.query('INSERT INTO invoices (patient_id, patient_name, total, vat_amount, description, service_type, paid, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,0,$7,$8)',

                [patient_id, p?.name_en || p?.name_ar || '', finalTotal, vatAmount, desc, 'Radiology', tenantId || null, facilityId || null]);

        }

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_RADIOLOGY_ORDER', 'Radiology',

            `Radiology order: ${order_type} for patient #${patient_id}`, req.ip);

        res.json((await pool.query('SELECT * FROM lab_radiology_orders WHERE id=$1', [result.rows[0].id])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/radiology/orders/:id/upload', requireAuth, upload.single('image'), async (req, res) => {

    try {

        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const orderId = req.params.id;

        // --- TENANT SCOPE: verify order belongs to current tenant before upload (IDOR prevention) ---

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [orderId, tenantId] : [orderId];

        const order = (await pool.query(`SELECT * FROM lab_radiology_orders WHERE id=$1${tenantCheck}`, tenantParams)).rows[0];

        if (!order) return res.status(404).json({ error: 'Order not found' });

        // A3A: register file in tenant-scoped phi_files vault; serve only via guarded /api/phi-files/:id (never a public path)

        const crypto = require('crypto');

        const plainBuf = fs.readFileSync(req.file.path);

        const sha256 = crypto.createHash('sha256').update(plainBuf).digest('hex'); // integrity hash of the ORIGINAL bytes

        // A3: encrypt file at-rest (AES-256-GCM / DPAPI KEK) when configured — overwrite the on-disk file with ciphertext

        let encrypted = false;

        if (ce.isEnabled()) {

            try { fs.writeFileSync(req.file.path, Buffer.from(ce.encrypt(plainBuf), 'utf8')); encrypted = true; }

            catch (encErr) { console.error('PHI encrypt failed, storing plaintext:', encErr.message); }

        }

        const phi = (await pool.query(

            'INSERT INTO phi_files (record_type, record_id, stored_path, original_name, sha256, encrypted, uploaded_by_user_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',

            ['radiology_order', orderId, req.file.path, req.file.originalname || req.file.filename, sha256, encrypted, req.session.user?.id])).rows[0];

        const imagePath = `/api/phi-files/${phi.id}`;

        const existingResults = order.results || '';

        const imageTag = `[IMG:${imagePath}]`;

        const newResults = existingResults ? `${existingResults}\n${imageTag}` : imageTag;

        await pool.query('UPDATE lab_radiology_orders SET results=$1 WHERE id=$2', [newResults, orderId]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'UPLOAD_RADIOLOGY_IMAGE', 'Radiology',

            `Uploaded image for radiology order #${orderId} (phi_file #${phi.id})`, req.ip);

        const updated = (await pool.query('SELECT * FROM lab_radiology_orders WHERE id=$1', [orderId])).rows[0];

        res.json({ success: true, path: imagePath, order: updated });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/radiology/worklist', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(403).json({ error: 'Tenant scope required' }); // FAIL-CLOSED

        const rows = (await pool.query(

            `SELECT e.*, p.name_en AS patient_name

             FROM rad_exams e LEFT JOIN patients p ON e.patient_id = p.id

             WHERE e.tenant_id = $1

             ORDER BY CASE e.state

                WHEN 'Scheduled' THEN 0 WHEN 'Arrived' THEN 1 WHEN 'InProgress' THEN 2

                WHEN 'Completed' THEN 3 WHEN 'Reported' THEN 4 ELSE 5 END, e.id DESC`,

            [tenantId])).rows;

        res.json(rows);

    } catch (e) {

        if (e.code === '42P01' || e.code === '42703') return res.json([]);

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/radiology/worklist', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(403).json({ error: 'Tenant scope required' }); // FAIL-CLOSED

        const { rad_order_id, modality, exam_name, accession, scheduled_at } = req.body;

        if (!rad_order_id) return res.status(400).json({ error: 'rad_order_id required' });

        // verify order belongs to current tenant (IDOR prevention) — explicit predicate

        const order = (await pool.query(

            'SELECT id, patient_id, order_type FROM lab_radiology_orders WHERE id=$1 AND is_radiology=1 AND tenant_id=$2',

            [rad_order_id, tenantId])).rows[0];

        if (!order) return res.status(404).json({ error: 'Radiology order not found' });

        const r = await pool.query(

            `INSERT INTO rad_exams (tenant_id, facility_id, rad_order_id, patient_id, modality, exam_name, accession, state, scheduled_at, created_by)

             VALUES ($1,$2,$3,$4,$5,$6,$7,'Scheduled',$8,$9) RETURNING *`,

            [tenantId, facilityId || null, rad_order_id, order.patient_id, modality || '',

             exam_name || order.order_type || '', accession || '', scheduled_at || null, req.session.user?.id || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_RAD_EXAM', 'Radiology',

            `Scheduled rad exam for order #${rad_order_id} (exam #${r.rows[0].id})`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/radiology/worklist/:id/state', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(403).json({ error: 'Tenant scope required' }); // FAIL-CLOSED

        const examId = parseInt(req.params.id, 10);

        if (!Number.isInteger(examId)) return res.status(404).json({ error: 'Exam not found' });

        const { state } = req.body;

        if (!RAD_WORKLIST_STATES.includes(state)) return res.status(400).json({ error: 'Invalid state' });

        // verify exam belongs to current tenant (explicit predicate, IDOR + RLS backstop)

        const exam = (await pool.query('SELECT id, state FROM rad_exams WHERE id=$1 AND tenant_id=$2', [examId, tenantId])).rows[0];

        if (!exam) return res.status(404).json({ error: 'Exam not found' });

        // enforce forward-only state machine

        if (state !== exam.state && !(RAD_WORKLIST_NEXT[exam.state] || []).includes(state)) {

            return res.status(400).json({ error: `Illegal transition ${exam.state} -> ${state}` });

        }

        const tsCol = { Arrived: 'arrived_at', InProgress: 'started_at', Completed: 'completed_at', Reported: 'reported_at' }[state];

        const setTs = tsCol ? `, ${tsCol}=COALESCE(${tsCol}, CURRENT_TIMESTAMP)` : '';

        await pool.query(

            `UPDATE rad_exams SET state=$1, updated_at=CURRENT_TIMESTAMP${setTs} WHERE id=$2 AND tenant_id=$3`,

            [state, examId, tenantId]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'UPDATE_RAD_EXAM_STATE', 'Radiology',

            `Rad exam #${examId} ${exam.state} -> ${state}`, req.ip);

        res.json((await pool.query('SELECT * FROM rad_exams WHERE id=$1 AND tenant_id=$2', [examId, tenantId])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/radiology/dicom-studies', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(403).json({ error: 'Tenant scope required' }); // FAIL-CLOSED

        const { rad_exam_id, study_uid, accession, modality, study_desc, series_count, instance_count, stored_ref } = req.body;

        let patientId = null, radOrderId = null;

        if (rad_exam_id) {

            // exam must belong to current tenant (explicit predicate)

            const exam = (await pool.query('SELECT id, patient_id, rad_order_id FROM rad_exams WHERE id=$1 AND tenant_id=$2', [rad_exam_id, tenantId])).rows[0];

            if (!exam) return res.status(404).json({ error: 'Exam not found' });

            patientId = exam.patient_id; radOrderId = exam.rad_order_id;

        }

        // if a stored_ref (phi_files.id) is provided, it must be a tenant-owned PHI object — never a public path

        if (stored_ref) {

            const phi = (await pool.query('SELECT id FROM phi_files WHERE id=$1 AND tenant_id=$2', [parseInt(stored_ref, 10) || 0, tenantId])).rows[0];

            if (!phi) return res.status(404).json({ error: 'Referenced file not found' });

        }

        const r = await pool.query(

            `INSERT INTO dicom_studies (tenant_id, facility_id, rad_exam_id, rad_order_id, patient_id, study_uid, accession, modality, study_desc, series_count, instance_count, stored_ref, source, created_by)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'manual',$13) RETURNING *`,

            [tenantId, facilityId || null, rad_exam_id || null, radOrderId, patientId,

             study_uid || '', accession || '', modality || '', study_desc || '',

             parseInt(series_count, 10) || 0, parseInt(instance_count, 10) || 0, stored_ref ? (parseInt(stored_ref, 10) || null) : null,

             req.session.user?.id || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'REGISTER_DICOM_STUDY', 'Radiology',

            `Registered DICOM study metadata (study #${r.rows[0].id}, accession ${accession || '-'})`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/radiology/dicom-studies', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(403).json({ error: 'Tenant scope required' }); // FAIL-CLOSED

        const examId = parseInt(req.query.rad_exam_id, 10);

        const params = [tenantId];

        let sql = 'SELECT * FROM dicom_studies WHERE tenant_id=$1';

        if (Number.isInteger(examId)) { sql += ' AND rad_exam_id=$2'; params.push(examId); }

        sql += ' ORDER BY id DESC';

        res.json((await pool.query(sql, params)).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/radiology/mwl', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(403).json({ error: 'Tenant scope required' }); // FAIL-CLOSED

        // serve our OWN scheduled exams as a worklist for modalities — purely local, no PACS pull

        let rows, source = 'rad_exams';

        try {

            rows = (await pool.query(

                `SELECT e.id, e.accession, e.modality, e.exam_name, e.scheduled_at, e.patient_id,

                        p.name_en AS patient_name, p.national_id

                 FROM rad_exams e LEFT JOIN patients p ON e.patient_id = p.id AND p.tenant_id = e.tenant_id

                 WHERE e.tenant_id=$1 AND e.state IN ('Scheduled','Arrived')

                 ORDER BY e.scheduled_at NULLS LAST, e.id`,

                [tenantId])).rows;

        } catch (e) {

            if (!isOptionalReadSchemaError(e)) throw e;

            source = 'legacy_radiology_orders';

            rows = (await pool.query(

                `SELECT o.id,

                        COALESCE(NULLIF(o.sample_serial, ''), 'RAD-' || o.id::text) AS accession,

                        '' AS modality,

                        COALESCE(NULLIF(o.order_type, ''), 'Radiology Exam') AS exam_name,

                        o.created_at AS scheduled_at,

                        o.patient_id,

                        p.name_en AS patient_name,

                        p.national_id

                 FROM lab_radiology_orders o

                 LEFT JOIN patients p ON p.id = o.patient_id AND p.tenant_id = $1

                 WHERE o.is_radiology = 1 AND (o.tenant_id = $1 OR o.tenant_id IS NULL)

                   AND COALESCE(o.status, '') NOT IN ('Completed','Cancelled','Canceled','Reported')

                 ORDER BY o.created_at NULLS LAST, o.id`,

                [tenantId])).rows;

        }

        logAudit(req.session.user?.id, req.session.user?.display_name, 'READ_RAD_MWL', 'Radiology',

            `Served local MWL worklist (${rows.length} items, source=${source}, external=${RAD_MWL_ENABLED ? 'enabled' : 'disabled'})`, req.ip);

        res.json({ worklist: rows, count: rows.length, source, external_mwl_enabled: RAD_MWL_ENABLED, external_connection: false });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/radiology/reports/priors', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(403).json({ error: 'Tenant scope required' }); // FAIL-CLOSED

        const patientId = parseInt(req.query.patient_id, 10);

        if (!Number.isInteger(patientId)) return res.status(400).json({ error: 'patient_id required' });

        const modality = req.query.modality || '';

        // E3 Issue-1 lesson: return ONLY signed priors (status='Signed' AND signed_at present), tenant-scoped

        const rows = (await pool.query(

            `SELECT id, rad_exam_id, modality, template, impression, birads, signed_by, signed_at, created_at

             FROM rad_reports

             WHERE tenant_id=$1 AND patient_id=$2 AND status='Signed' AND signed_at IS NOT NULL

               AND ($3 = '' OR modality = $3)

             ORDER BY signed_at DESC`,

            [tenantId, patientId, modality])).rows;

        res.json(rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/radiology/reports', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(403).json({ error: 'Tenant scope required' }); // FAIL-CLOSED

        const { rad_exam_id, template, structured_json, findings, impression, birads, is_critical, prior_study_id } = req.body;

        if (!rad_exam_id) return res.status(400).json({ error: 'rad_exam_id required' });

        // exam must belong to current tenant (explicit predicate)

        const exam = (await pool.query('SELECT id, patient_id, rad_order_id, modality FROM rad_exams WHERE id=$1 AND tenant_id=$2', [rad_exam_id, tenantId])).rows[0];

        if (!exam) return res.status(404).json({ error: 'Exam not found' });

        // prior_study_id (if supplied) must be a SIGNED tenant-owned prior report

        if (prior_study_id) {

            const prior = (await pool.query(

                "SELECT id FROM rad_reports WHERE id=$1 AND tenant_id=$2 AND status='Signed' AND signed_at IS NOT NULL",

                [parseInt(prior_study_id, 10) || 0, tenantId])).rows[0];

            if (!prior) return res.status(404).json({ error: 'Prior report not found or not signed' });

        }

        const r = await pool.query(

            `INSERT INTO rad_reports (tenant_id, facility_id, rad_exam_id, rad_order_id, patient_id, modality, template, structured_json, findings, impression, birads, is_critical, prior_study_id, status, radiologist_id, created_by)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'Draft',$14,$14) RETURNING *`,

            [tenantId, facilityId || null, rad_exam_id, exam.rad_order_id, exam.patient_id, exam.modality || '',

             template || 'generic', structured_json || '', findings || '', impression || '', birads || '',

             !!is_critical, prior_study_id ? (parseInt(prior_study_id, 10) || null) : null, req.session.user?.id || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_RAD_REPORT', 'Radiology',

            `Drafted rad report #${r.rows[0].id} for exam #${rad_exam_id}${is_critical ? ' [CRITICAL]' : ''}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/radiology/reports/:id/critical-notify', requireAuth, requireRole('radiology', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(403).json({ error: 'Tenant scope required' }); // FAIL-CLOSED

        const reportId = parseInt(req.params.id, 10);

        if (!Number.isInteger(reportId)) return res.status(404).json({ error: 'Report not found' });

        const { notified_doctor_id, note } = req.body;

        // report must belong to current tenant (explicit predicate)

        const rep = (await pool.query('SELECT id, patient_id, rad_order_id, is_critical FROM rad_reports WHERE id=$1 AND tenant_id=$2', [reportId, tenantId])).rows[0];

        if (!rep) return res.status(404).json({ error: 'Report not found' });

        // document the critical notification: notifications row (type='critical') + audit (canonical channel)

        let notifId = null;

        let target = notified_doctor_id ? parseInt(notified_doctor_id, 10) : null;

        // validate notified_doctor_id is a REAL existing user before using it as a notification user_id

        // (never insert a dangling/foreign user_id). system_users has no tenant_id; scope via user_tenants to the session tenant.

        if (target) {

            if (!Number.isInteger(target) || target <= 0) return res.status(400).json({ error: 'Invalid notified_doctor_id' });

            const u = (await pool.query(

                `SELECT u.id FROM system_users u

                 JOIN user_tenants ut ON ut.user_id = u.id

                 WHERE u.id = $1 AND ut.tenant_id = $2 AND ut.is_active = true`,

                [target, tenantId])).rows[0];

            if (!u) return res.status(400).json({ error: 'notified_doctor_id not found in this tenant' });

        }

        const msg = `CRITICAL radiology finding for patient #${rep.patient_id} (report #${reportId})${note ? ': ' + note : ''}`;

        if (target) {

            const n = await pool.query('INSERT INTO notifications (user_id, title, message, type, module, record_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',

                [target, 'Critical Radiology Finding', msg, 'critical', 'Radiology', reportId]);

            notifId = n.rows[0].id;

        } else {

            const n = await pool.query('INSERT INTO notifications (target_role, title, message, type, module, record_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',

                ['Doctor', 'Critical Radiology Finding', msg, 'critical', 'Radiology', reportId]);

            notifId = n.rows[0].id;

        }

        await pool.query('UPDATE rad_reports SET critical_notified_at=CURRENT_TIMESTAMP, critical_notify_ref=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2 AND tenant_id=$3',

            [notifId, reportId, tenantId]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'RAD_CRITICAL_NOTIFY', 'Radiology',

            `Documented critical notification for report #${reportId} (notification #${notifId})`, req.ip);



        // Send SMS to the notified doctor

        if (target) {

            try {

                const smsText = `تنبيه طبي عاجل: نتيجة أشعة حرجة للمريض #${rep.patient_id} (تقرير #${reportId}). يرجى المراجعة الفورية.\nUrgent Medical Alert: Critical radiology finding for patient #${rep.patient_id} (Report #${reportId}).`;

                await sendDoctorSMS(target, smsText, 'RAD_CRITICAL_ALERT');

            } catch (smsErr) { console.error('[SMS ERROR] Critical radiology notify SMS failed:', smsErr.message); }

        }



        res.json((await pool.query('SELECT * FROM rad_reports WHERE id=$1 AND tenant_id=$2', [reportId, tenantId])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/radiology/reports/:id/sign', requireAuth, requireRole('radiology', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(403).json({ error: 'Tenant scope required' }); // FAIL-CLOSED

        const reportId = parseInt(req.params.id, 10);

        if (!Number.isInteger(reportId)) return res.status(404).json({ error: 'Report not found' });

        const rep = (await pool.query('SELECT id, rad_exam_id, is_critical, critical_notified_at, status FROM rad_reports WHERE id=$1 AND tenant_id=$2', [reportId, tenantId])).rows[0];

        if (!rep) return res.status(404).json({ error: 'Report not found' });

        if (rep.status === 'Signed') return res.status(409).json({ error: 'Report already signed' });

        // CRITICAL FAIL-CLOSED: cannot reach signed/final without notification documented

        if (rep.is_critical && !rep.critical_notified_at) {

            return res.status(409).json({ error: 'Critical finding must be notified before signing', code: 'CRITICAL_NOTIFY_REQUIRED' });

        }

        await pool.query("UPDATE rad_reports SET status='Signed', signed_by=$1, signed_at=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP WHERE id=$2 AND tenant_id=$3",

            [req.session.user?.id || null, reportId, tenantId]);

        // advance the worklist exam to Reported (tenant-scoped), then CLOSE THE LOOP to the

        // originating legacy radiology order — same result_loop patient-match guard as lab.

        let radOrderClosed = null;

        if (rep.rad_exam_id) {

            await pool.query("UPDATE rad_exams SET state='Reported', reported_at=COALESCE(reported_at, CURRENT_TIMESTAMP), updated_at=CURRENT_TIMESTAMP WHERE id=$1 AND tenant_id=$2 AND state IN ('Completed','InProgress','Arrived','Scheduled')",

                [rep.rad_exam_id, tenantId]);

            const exam = (await pool.query('SELECT id, patient_id, rad_order_id FROM rad_exams WHERE id=$1 AND tenant_id=$2', [rep.rad_exam_id, tenantId])).rows[0];

            if (exam && exam.rad_order_id) {

                const legacyOrder = (await pool.query(

                    'SELECT id, patient_id, status FROM lab_radiology_orders WHERE id=$1 AND (tenant_id=$2 OR tenant_id IS NULL)',

                    [exam.rad_order_id, tenantId])).rows[0];

                const decision = resultLoop.shouldCloseLegacyOrder(exam, legacyOrder);

                if (decision.close) {

                    await pool.query(

                        "UPDATE lab_radiology_orders SET status='Completed', result_date=CURRENT_TIMESTAMP::text WHERE id=$1 AND (tenant_id=$2 OR tenant_id IS NULL)",

                        [exam.rad_order_id, tenantId]);

                    radOrderClosed = exam.rad_order_id;

                }

            }

        }

        logAudit(req.session.user?.id, req.session.user?.display_name, 'SIGN_RAD_REPORT', 'Radiology',

            `Signed rad report #${reportId}${rep.is_critical ? ' [CRITICAL, notified]' : ''}` +

            (radOrderClosed ? ` — order #${radOrderClosed} closed (loop)` : ''), req.ip);



        // Trigger SMS notification to patient

        if (rep) {

            await sendRadiologyResultNotification(rep.rad_order_id, rep.patient_id, tenantId);

        }



        res.json((await pool.query('SELECT * FROM rad_reports WHERE id=$1 AND tenant_id=$2', [reportId, tenantId])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/radiology/reports/:id/addendum', requireAuth, requireRole('radiology', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(403).json({ error: 'Tenant scope required' }); // FAIL-CLOSED

        const parentId = parseInt(req.params.id, 10);

        if (!Number.isInteger(parentId)) return res.status(404).json({ error: 'Report not found' });

        const { findings, impression, is_critical } = req.body;

        const parent = (await pool.query("SELECT * FROM rad_reports WHERE id=$1 AND tenant_id=$2 AND status='Signed'", [parentId, tenantId])).rows[0];

        if (!parent) return res.status(404).json({ error: 'Signed parent report not found' });

        const r = await pool.query(

            `INSERT INTO rad_reports (tenant_id, facility_id, rad_exam_id, rad_order_id, patient_id, modality, template, findings, impression, is_critical, status, addendum_of, radiologist_id, created_by)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Draft',$11,$12,$12) RETURNING *`,

            [tenantId, facilityId || null, parent.rad_exam_id, parent.rad_order_id, parent.patient_id, parent.modality,

             'addendum', findings || '', impression || '', !!is_critical, parentId, req.session.user?.id || null]);

        await pool.query("UPDATE rad_reports SET status='Addended', updated_at=CURRENT_TIMESTAMP WHERE id=$1 AND tenant_id=$2", [parentId, tenantId]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'ADDENDUM_RAD_REPORT', 'Radiology',

            `Addendum #${r.rows[0].id} to signed report #${parentId}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/radiology/reports', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(403).json({ error: 'Tenant scope required' }); // FAIL-CLOSED

        const examId = parseInt(req.query.rad_exam_id, 10);

        const params = [tenantId];

        let sql = 'SELECT * FROM rad_reports WHERE tenant_id=$1';

        if (Number.isInteger(examId)) { sql += ' AND rad_exam_id=$2'; params.push(examId); }

        sql += ' ORDER BY id DESC';

        res.json((await pool.query(sql, params)).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/radiology/orders', requireAuth, async (req, res) => {

    try {

        // --- TENANT SCOPE: filter radiology orders by current tenant_id ---

        const { tenantId } = getRequestTenantContext(req);

        const tenantFilter = tenantId ? ' AND o.tenant_id=$1' : '';

        const queryParams = tenantId ? [tenantId] : [];

        const rows = (await pool.query(`SELECT o.*, p.name_ar as patient_name, p.file_number, p.phone, su.display_name as doctor

            FROM lab_radiology_orders o LEFT JOIN patients p ON o.patient_id = p.id

            LEFT JOIN system_users su ON o.doctor_id = su.id

            WHERE o.is_radiology = 1 AND o.approval_status IN ('Approved', 'Paid')${tenantFilter}

            ORDER BY o.id DESC`, queryParams)).rows;

        res.json(rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/radiology/orders', requireAuth, async (req, res) => {

    try {

        const { patient_id, order_type, description } = req.body;

        // --- TENANT SCOPE: stamp tenant_id from session + validate patient belongs to same tenant ---

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (tenantId && patient_id) {

            const patientCheck = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

            if (!patientCheck) return res.status(404).json({ error: 'Patient not found' });

        }

        const pName = (await pool.query('SELECT name_ar, name_en FROM patients WHERE id=$1', [patient_id])).rows[0];

        const r = await pool.query(

            `INSERT INTO lab_radiology_orders (patient_id, doctor_id, order_type, description, status, is_radiology, approval_status, tenant_id, facility_id)

             VALUES ($1, $2, $3, $4, 'Pending Payment', 1, 'Pending Approval', $5, $6) RETURNING *`,

            [patient_id, req.session.user?.id || 0, order_type || '', description || '', tenantId || null, facilityId || null]

        );

        r.rows[0].patient_name = pName?.name_ar || pName?.name_en || '';

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_RADIOLOGY_ORDER', 'Radiology',

            `Radiology order: ${order_type} for patient #${patient_id}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
