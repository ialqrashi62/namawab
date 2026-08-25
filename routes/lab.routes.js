const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeLabRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, sendLabResultNotification, sendDoctorSMS, sendDoctorEmail, lis, lisRequireTenant, resultLoop }) {
    const router = express.Router();
router.get('/api/lab/orders', requireAuth, async (req, res) => {

    try {

        // --- TENANT SCOPE: filter lab orders by current tenant_id ---

        const { tenantId } = getRequestTenantContext(req);

        let rows;

        if (tenantId) {

            rows = (await pool.query(`SELECT lo.*, p.name_en as patient_name FROM lab_radiology_orders lo

                LEFT JOIN patients p ON lo.patient_id=p.id

                WHERE lo.is_radiology=0 AND lo.tenant_id=$1 ORDER BY lo.id DESC`, [tenantId])).rows;

        } else {

            rows = (await pool.query('SELECT lo.*, p.name_en as patient_name FROM lab_radiology_orders lo LEFT JOIN patients p ON lo.patient_id=p.id WHERE lo.is_radiology=0 ORDER BY lo.id DESC')).rows;

        }

        res.json(rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/lab/orders', requireAuth, async (req, res) => {

    try {

        const { patient_id, doctor_id, order_type, description, price } = req.body;

        // --- TENANT SCOPE: stamp tenant_id from session + validate patient belongs to same tenant ---

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (tenantId && patient_id) {

            const patientCheck = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

            if (!patientCheck) return res.status(404).json({ error: 'Patient not found' });

        }

        // Auto-lookup price from lab catalog (with tenant overrides) if not provided

        let labPrice = parseFloat(price) || 0;

        if (!labPrice && order_type) {

            const catalogMatch = (await pool.query(`

                SELECT COALESCE(o.custom_price, lt.price) AS price

                FROM lab_tests_catalog lt

                LEFT JOIN tenant_lab_test_overrides o ON lt.id = o.test_id AND o.tenant_id = $2

                WHERE lt.test_name ILIKE $1 LIMIT 1

            `, [`%${order_type}%`, tenantId || null])).rows[0];

            if (catalogMatch) labPrice = catalogMatch.price;

        }

        const result = await pool.query('INSERT INTO lab_radiology_orders (patient_id, doctor_id, order_type, description, is_radiology, price, tenant_id, facility_id) VALUES ($1,$2,$3,$4,0,$5,$6,$7) RETURNING id',

            [patient_id, doctor_id || 0, order_type || '', description || '', labPrice, tenantId || null, facilityId || null]);

        // Auto-create invoice for lab test (with VAT for non-Saudis)

        if (labPrice > 0 && patient_id) {

            const p = (await pool.query('SELECT name_en, name_ar FROM patients WHERE id=$1', [patient_id])).rows[0];

            const vat = await calcVAT(patient_id);

            const { total: finalTotal, vatAmount } = addVAT(labPrice, vat.rate);

            const desc = `فحص مختبر: ${order_type}` + (vat.applyVAT ? ` (+ ضريبة ${vatAmount} SAR)` : '');

            await pool.query('INSERT INTO invoices (patient_id, patient_name, total, vat_amount, description, service_type, paid, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,0,$7,$8)',

                [patient_id, p?.name_en || p?.name_ar || '', finalTotal, vatAmount, desc, 'Lab Test', tenantId || null, facilityId || null]);

        }

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_LAB_ORDER', 'Lab',

            `Lab order: ${order_type} for patient #${patient_id}`, req.ip);

        res.json((await pool.query('SELECT * FROM lab_radiology_orders WHERE id=$1', [result.rows[0].id])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/lab/catalog', requireAuth, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const sql = `

            SELECT

                lt.id,

                lt.test_name,

                lt.category,

                lt.normal_range,

                COALESCE(o.custom_price, lt.price) AS price,

                COALESCE(o.is_active, 1) AS is_active

            FROM lab_tests_catalog lt

            LEFT JOIN tenant_lab_test_overrides o ON lt.id = o.test_id AND o.tenant_id = $1

            ORDER BY lt.id

        `;

        res.json((await pool.query(sql, [tenantId || null])).rows);

    }

    catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/lab/orders/:id', requireAuth, async (req, res) => {

    try {

        const { status, result: testResult } = req.body;

        // --- TENANT SCOPE: verify order belongs to current tenant before update (IDOR prevention) ---

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const orderCheck = (await pool.query(`SELECT * FROM lab_radiology_orders WHERE id=$1${tenantCheck}`, tenantParams)).rows[0];

        if (!orderCheck) return res.status(404).json({ error: 'Order not found' });

        if (status) await pool.query('UPDATE lab_radiology_orders SET status=$1 WHERE id=$2', [status, req.params.id]);

        // Notify doctor when result is ready

        if (status === 'Completed') {

            if (orderCheck) await pool.query('INSERT INTO notifications (user_id, title, message, type, module) VALUES ($1,$2,$3,$4,$5)',

                [orderCheck.doctor_id, (orderCheck.is_radiology ? 'Radiology' : 'Lab') + ' Result Ready',

                orderCheck.order_type + ' for patient #' + orderCheck.patient_id + ' is complete', 'success', 'Lab']);

        }

        if (testResult) await pool.query('UPDATE lab_radiology_orders SET results=$1 WHERE id=$2', [testResult, req.params.id]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'UPDATE_LAB_ORDER', 'Lab',

            `Updated lab order #${req.params.id} status:${status || '-'} result:${testResult ? 'yes' : 'no'}`, req.ip);

        res.json((await pool.query('SELECT * FROM lab_radiology_orders WHERE id=$1', [req.params.id])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/lab/samples', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const ctx = lisRequireTenant(req, res); if (!ctx) return;

        const rows = (await pool.query(

            `SELECT s.*, NULL::text AS patient_name, s.order_id AS lab_order_id

             FROM lab_samples s

             WHERE s.tenant_id = $1 ORDER BY s.id DESC`, [ctx.tenantId])).rows;

        res.json(rows);

    } catch (e) {

        if (e.code === '42P01' || e.code === '42703') return res.json([]);

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/lab/samples', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const ctx = lisRequireTenant(req, res); if (!ctx) return;

        const { lab_order_id, patient_id, notes } = req.body;

        // IDOR: if a lab order is referenced, it must belong to this tenant.

        if (lab_order_id) {

            const ord = (await pool.query('SELECT id, patient_id FROM lab_radiology_orders WHERE id=$1 AND tenant_id=$2', [lab_order_id, ctx.tenantId])).rows[0];

            if (!ord) return res.status(404).json({ error: 'Lab order not found' });

        }

        // IDOR: if a patient is referenced, it must belong to this tenant.

        if (patient_id) {

            const pt = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, ctx.tenantId])).rows[0];

            if (!pt) return res.status(404).json({ error: 'Patient not found' });

        }

        // Server-generated barcode: LAB-{order||0}-{epoch}{rand} — unique per tenant.

        const barcode = `LAB-${lab_order_id || 0}-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;

        const ins = await pool.query(

            `INSERT INTO lab_samples (tenant_id, facility_id, lab_order_id, patient_id, barcode, state, collected_by, notes)

             VALUES ($1,$2,$3,$4,$5,'Collected',$6,$7) RETURNING *`,

            [ctx.tenantId, ctx.facilityId || null, lab_order_id || null, patient_id || null, barcode, req.session.user?.id || null, notes || '']);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'LAB_SAMPLE_COLLECT', 'Lab',

            `Sample ${barcode} collected for order #${lab_order_id || '-'}`, req.ip);

        res.json(ins.rows[0]);

    } catch (e) {

        if (e && e.code === '23505') return res.status(409).json({ error: 'Duplicate barcode' });

        res.status(500).json({ error: 'Server error' });

    }

});

router.put('/api/lab/samples/:id', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const ctx = lisRequireTenant(req, res); if (!ctx) return;

        const { action, rejected_reason } = req.body;

        // explicit tenant predicate (defense-in-depth) before any mutation.

        const sample = (await pool.query('SELECT * FROM lab_samples WHERE id=$1 AND tenant_id=$2', [req.params.id, ctx.tenantId])).rows[0];

        if (!sample) return res.status(404).json({ error: 'Sample not found' });



        // Allowed forward transitions (Verified/Reported are driven by result verification, not here).

        const transitions = {

            receive: { from: ['Collected'], to: 'Received' },

            process: { from: ['Received'], to: 'InProcess' },

            reject: { from: ['Collected', 'Received', 'InProcess'], to: 'Rejected' },

        };

        const t = transitions[action];

        if (!t) return res.status(400).json({ error: 'Invalid action' });

        if (!t.from.includes(sample.state)) return res.status(409).json({ error: `Cannot ${action} a sample in state ${sample.state}` });

        if (action === 'reject' && !rejected_reason) return res.status(400).json({ error: 'rejected_reason required' });



        if (action === 'receive') {

            await pool.query('UPDATE lab_samples SET state=$1, received_by=$2, received_at=CURRENT_TIMESTAMP WHERE id=$3 AND tenant_id=$4',

                [t.to, req.session.user?.id || null, req.params.id, ctx.tenantId]);

        } else if (action === 'reject') {

            await pool.query('UPDATE lab_samples SET state=$1, rejected_reason=$2, rejected_by=$3, rejected_at=CURRENT_TIMESTAMP WHERE id=$4 AND tenant_id=$5',

                [t.to, rejected_reason, req.session.user?.id || null, req.params.id, ctx.tenantId]);

        } else {

            await pool.query('UPDATE lab_samples SET state=$1 WHERE id=$2 AND tenant_id=$3', [t.to, req.params.id, ctx.tenantId]);

        }

        logAudit(req.session.user?.id, req.session.user?.display_name, 'LAB_SAMPLE_' + action.toUpperCase(), 'Lab',

            `Sample #${req.params.id} -> ${t.to}${rejected_reason ? ' (' + rejected_reason + ')' : ''}`, req.ip);

        res.json((await pool.query('SELECT * FROM lab_samples WHERE id=$1 AND tenant_id=$2', [req.params.id, ctx.tenantId])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/lab/results', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const ctx = lisRequireTenant(req, res); if (!ctx) return;

        let rows;

        if (req.query.sample_id) {

            rows = (await pool.query('SELECT * FROM lab_results WHERE tenant_id=$1 AND lab_sample_id=$2 ORDER BY id DESC', [ctx.tenantId, req.query.sample_id])).rows;

        } else {

            rows = (await pool.query('SELECT * FROM lab_results WHERE tenant_id=$1 ORDER BY id DESC LIMIT 500', [ctx.tenantId])).rows;

        }

        res.json(rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/lab/results', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const ctx = lisRequireTenant(req, res); if (!ctx) return;

        const { lab_sample_id, loinc, test_name, value, unit, normal_range, ref_low, ref_high, order_id } = req.body;

        if (!test_name || value === undefined || value === null || String(value).trim() === '') {

            return res.status(400).json({ error: 'test_name and value are required' });

        }

        // IDOR: sample (if referenced) must belong to this tenant.

        let sample = null;

        if (lab_sample_id) {

            sample = (await pool.query('SELECT * FROM lab_samples WHERE id=$1 AND tenant_id=$2', [lab_sample_id, ctx.tenantId])).rows[0];

            if (!sample) return res.status(404).json({ error: 'Sample not found' });

        }

        // Prior result for the same analyte (delta-check) within tenant — most recent VERIFIED.

        // CLINICAL SAFETY: only a VERIFIED prior may serve as the delta baseline. A held/pending

        // (unverified/erroneous) prior must NOT suppress a true significant delta. ('reported' is

        // tracked by the separate `reported` column, not status, so status='verified' covers it.)

        let prior = null;

        if (sample && sample.patient_id) {

            prior = (await pool.query(

                `SELECT lr.* FROM lab_results lr

                 JOIN lab_samples s ON lr.lab_sample_id = s.id AND s.tenant_id = lr.tenant_id

                 WHERE lr.tenant_id=$1 AND s.patient_id=$2 AND lower(lr.test_name)=lower($3) AND lr.status = 'verified'

                 ORDER BY lr.id DESC LIMIT 1`, [ctx.tenantId, sample.patient_id, test_name])).rows[0] || null;

        }

        // CLINICAL SAFETY: pure-function auto-verify (any uncertainty -> HOLD).

        const verdict = lis.autoVerify({ test_name, value, unit, ref_low, ref_high }, prior);

        const ins = await pool.query(

            `INSERT INTO lab_results

               (tenant_id, facility_id, lab_sample_id, order_id, loinc, test_name, value, unit, normal_range,

                ref_low, ref_high, abnormal_flag, delta_pct, is_critical, is_abnormal, status, hold_reasons)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,

            [ctx.tenantId, ctx.facilityId || null, lab_sample_id || null, order_id || null, loinc || null, test_name,

             String(value), unit || '', normal_range || '',

             (ref_low === undefined || ref_low === '' ? null : ref_low),

             (ref_high === undefined || ref_high === '' ? null : ref_high),

             verdict.abnormal_flag, verdict.delta_pct, verdict.is_critical ? 1 : 0, verdict.is_abnormal,

             verdict.status, verdict.reasons.join(',')]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'LAB_RESULT_ENTER', 'Lab',

            `Result ${test_name}=${value} -> ${verdict.status}${verdict.is_critical ? ' [CRITICAL]' : ''} reasons:${verdict.reasons.join('|') || '-'}`, req.ip);



        // Trigger SMS notification

        if (ins.rows[0].status === 'verified') {

            await sendLabResultNotification(order_id, lab_sample_id, ctx.tenantId);

        }

        // If critical, send urgent SMS to ordering doctor

        if (verdict.is_critical && order_id) {

            try {

                const orderRow = (await pool.query(

                    `SELECT o.doctor_id, p.name_ar, p.name_en 

                     FROM lab_radiology_orders o 

                     JOIN patients p ON o.patient_id = p.id 

                     WHERE o.id = $1`, [order_id])).rows[0];

                if (orderRow && orderRow.doctor_id) {

                    const pName = orderRow.name_ar || orderRow.name_en || 'المريض';

                    const smsText = `تنبيه طبي عاجل: نتيجة حرجة للمريض ${pName} في تحليل ${test_name} (القيمة: ${value}). يرجى المراجعة الفورية.\nUrgent Medical Alert: Critical result for patient ${pName} in test ${test_name} (Value: ${value}).`;

                    await sendDoctorSMS(orderRow.doctor_id, smsText, 'LAB_CRITICAL_ALERT');



                    // Send Email to Doctor

                    const emailSubject = `تنبيه طبي عاجل: نتيجة حرجة للمريض | Urgent Medical Alert: Critical Result`;

                    const emailHtml = `

                        <div style="direction: rtl; text-align: right; font-family: sans-serif; padding: 20px; border: 2px solid #e74c3c; border-radius: 8px; background: #fff8f8;">

                            <h2 style="color: #c0392b;">تنبيه طبي عاجل: نتيجة مخبرية حرجة</h2>

                            <p><strong>المريض:</strong> ${pName}</p>

                            <p><strong>التحليل:</strong> ${test_name}</p>

                            <p><strong>القيمة المقاسة:</strong> <span style="color: #e74c3c; font-size: 18px; font-weight: bold;">${value} ${unit || ''}</span></p>

                            <p><strong>النطاق الطبيعي:</strong> ${normal_range || '-'}</p>

                            <p style="font-weight: bold; color: #c0392b;">يرجى المراجعة الطبية الفورية واتخاذ الإجراءات اللازمة لسلامة المريض.</p>

                            <hr style="border: 0; border-top: 1px solid #e74c3c; margin: 20px 0;">

                            <div style="direction: ltr; text-align: left;">

                                <h2 style="color: #c0392b;">Urgent Medical Alert: Critical Lab Result</h2>

                                <p><strong>Patient:</strong> ${pName}</p>

                                <p><strong>Test:</strong> ${test_name}</p>

                                <p><strong>Measured Value:</strong> <span style="color: #e74c3c; font-size: 18px; font-weight: bold;">${value} ${unit || ''}</span></p>

                                <p><strong>Normal Range:</strong> ${normal_range || '-'}</p>

                                <p style="font-weight: bold; color: #c0392b;">Please review immediately and take the necessary clinical actions.</p>

                            </div>

                        </div>

                    `;

                    sendDoctorEmail(orderRow.doctor_id, emailSubject, emailHtml);

                }

            } catch (smsErr) { console.error('[SMS ERROR] Critical lab alert SMS failed:', smsErr.message); }

        }



        res.json({ result: ins.rows[0], verdict });

    } catch (e) { console.error('LAB RESULTS POST ERROR:', e); res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/lab/results/:id/verify', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const ctx = lisRequireTenant(req, res); if (!ctx) return;

        const r = (await pool.query('SELECT * FROM lab_results WHERE id=$1 AND tenant_id=$2', [req.params.id, ctx.tenantId])).rows[0];

        if (!r) return res.status(404).json({ error: 'Result not found' });

        await pool.query('UPDATE lab_results SET status=$1, verified_by=$2, verified_at=CURRENT_TIMESTAMP WHERE id=$3 AND tenant_id=$4',

            ['verified', req.session.user?.id || null, req.params.id, ctx.tenantId]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'LAB_RESULT_VERIFY', 'Lab',

            `Manually verified result #${req.params.id}`, req.ip);



        // Trigger SMS notification on manual verification

        if (r) {

            await sendLabResultNotification(r.order_id, r.lab_sample_id, ctx.tenantId);

        }



        res.json((await pool.query('SELECT * FROM lab_results WHERE id=$1 AND tenant_id=$2', [req.params.id, ctx.tenantId])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/lab/results/:id/callback', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const ctx = lisRequireTenant(req, res); if (!ctx) return;

        const { notified_to, ack, notes } = req.body;

        if (!notified_to || String(notified_to).trim() === '') return res.status(400).json({ error: 'notified_to required' });

        const r = (await pool.query('SELECT * FROM lab_results WHERE id=$1 AND tenant_id=$2', [req.params.id, ctx.tenantId])).rows[0];

        if (!r) return res.status(404).json({ error: 'Result not found' });

        const ins = await pool.query(

            `INSERT INTO lab_critical_callbacks (tenant_id, facility_id, result_id, notified_to, notified_by, notified_by_name, ack, notes)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,

            [ctx.tenantId, ctx.facilityId || null, req.params.id, String(notified_to), req.session.user?.id || null,

             req.session.user?.display_name || '', ack ? 1 : 0, notes || '']);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'LAB_CRITICAL_CALLBACK', 'Lab',

            `Critical call-back for result #${req.params.id} -> ${notified_to}`, req.ip);

        res.json(ins.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/lab/results/:id/report', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const ctx = lisRequireTenant(req, res); if (!ctx) return;

        const r = (await pool.query('SELECT * FROM lab_results WHERE id=$1 AND tenant_id=$2', [req.params.id, ctx.tenantId])).rows[0];

        if (!r) return res.status(404).json({ error: 'Result not found' });

        // AUDIT/INTEGRITY: re-reporting an already-reported result is rejected (not silently idempotent).

        if (r.reported) return res.status(409).json({ error: 'Result already reported' });

        // must be verified first.

        if (r.status !== 'verified') return res.status(409).json({ error: 'Result must be verified before reporting' });

        // CLINICAL SAFETY (FAIL-CLOSED): a critical result cannot be reported without a documented call-back.

        if (r.is_critical) {

            // FAIL-CLOSED read-back: require an ACKNOWLEDGED call-back (ack=1) — the receiver confirmed

            // read-back per CAP/Joint Commission. A logged-but-unacknowledged call-back does NOT unlock

            // reporting (previously any call-back row, acknowledged or not, was accepted).

            const cb = (await pool.query('SELECT count(*)::int AS n FROM lab_critical_callbacks WHERE result_id=$1 AND tenant_id=$2 AND ack=1', [req.params.id, ctx.tenantId])).rows[0];

            if (!cb || cb.n === 0) {

                return res.status(409).json({ error: 'Critical result requires an ACKNOWLEDGED (read-back) call-back before reporting', code: 'CRITICAL_CALLBACK_ACK_REQUIRED' });

            }

        }

        // belt-and-suspenders: only flip an as-yet-unreported row (concurrency-safe with the 409 above).

        await pool.query('UPDATE lab_results SET reported=1, reported_at=CURRENT_TIMESTAMP WHERE id=$1 AND tenant_id=$2 AND reported = 0', [req.params.id, ctx.tenantId]);

        // advance the sample to Reported when present, then CLOSE THE LOOP back to the

        // originating legacy order (lab_radiology_orders) — guarded by result_loop:

        // patient must match between sample and order and the order must still be open

        // (closing the wrong patient's order is a patient-safety hazard, so any doubt

        // refuses the close). Unified E-X orders are NOT touched here: no sample carries

        // a unified order id until CPOE dispatch activates (see Gate 3 report).

        let orderClosed = null;

        if (r.lab_sample_id) {

            await pool.query("UPDATE lab_samples SET state='Reported' WHERE id=$1 AND tenant_id=$2", [r.lab_sample_id, ctx.tenantId]);

            const sample = (await pool.query('SELECT id, patient_id, lab_order_id FROM lab_samples WHERE id=$1 AND tenant_id=$2', [r.lab_sample_id, ctx.tenantId])).rows[0];

            if (sample && sample.lab_order_id) {

                const legacyOrder = (await pool.query(

                    'SELECT id, patient_id, status FROM lab_radiology_orders WHERE id=$1 AND (tenant_id=$2 OR tenant_id IS NULL)',

                    [sample.lab_order_id, ctx.tenantId])).rows[0];

                const decision = resultLoop.shouldCloseLegacyOrder(sample, legacyOrder);

                if (decision.close) {

                    await pool.query(

                        "UPDATE lab_radiology_orders SET status='Completed', result_date=CURRENT_TIMESTAMP::text WHERE id=$1 AND (tenant_id=$2 OR tenant_id IS NULL)",

                        [sample.lab_order_id, ctx.tenantId]);

                    orderClosed = sample.lab_order_id;

                }

            }

        }

        logAudit(req.session.user?.id, req.session.user?.display_name, 'LAB_RESULT_REPORT', 'Lab',

            `Reported result #${req.params.id}${r.is_critical ? ' [CRITICAL, call-back on file]' : ''}` +

            (orderClosed ? ` — order #${orderClosed} closed (loop)` : ''), req.ip);

        res.json((await pool.query('SELECT * FROM lab_results WHERE id=$1 AND tenant_id=$2', [req.params.id, ctx.tenantId])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/lab/hl7', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const ctx = lisRequireTenant(req, res); if (!ctx) return;

        // GATE: disabled unless explicitly enabled (no real analyzer/device wiring here).

        if (process.env.LAB_HL7_ENABLED !== 'true') {

            return res.status(403).json({ error: 'HL7 ingest disabled', code: 'HL7_GATED' });

        }

        const raw = typeof req.body === 'string' ? req.body : (req.body && req.body.message);

        const parsed = lis.parseHL7ORU(raw);

        if (!parsed.ok) return res.status(400).json({ error: 'Malformed HL7', detail: parsed.error });

        // Match specimen by barcode within tenant (explicit tenant predicate + RLS).

        const sample = (await pool.query('SELECT * FROM lab_samples WHERE barcode=$1 AND tenant_id=$2', [parsed.barcode, ctx.tenantId])).rows[0];

        if (!sample) return res.status(404).json({ error: 'No matching specimen for barcode in this tenant' });

        const stored = [];

        for (const obx of parsed.results) {

            const verdict = lis.autoVerify(obx, null);

            const ins = await pool.query(

                `INSERT INTO lab_results

                   (tenant_id, facility_id, lab_sample_id, loinc, test_name, value, unit, normal_range,

                    ref_low, ref_high, abnormal_flag, delta_pct, is_critical, is_abnormal, status, hold_reasons)

                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING id, status, is_critical`,

                [ctx.tenantId, ctx.facilityId || null, sample.id, obx.loinc || null, obx.test_name, String(obx.value),

                 obx.unit || '', '', obx.ref_low, obx.ref_high, verdict.abnormal_flag, verdict.delta_pct,

                 verdict.is_critical ? 1 : 0, verdict.is_abnormal, verdict.status, verdict.reasons.join(',')]);

            stored.push(ins.rows[0]);

        }

        logAudit(req.session.user?.id, req.session.user?.display_name, 'LAB_HL7_INGEST', 'Lab',

            `HL7 ORU ingested for barcode ${parsed.barcode}: ${stored.length} result(s)`, req.ip);

        res.json({ ok: true, barcode: parsed.barcode, stored });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/lab/qc', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const ctx = lisRequireTenant(req, res); if (!ctx) return;

        res.json((await pool.query('SELECT * FROM lab_qc WHERE tenant_id=$1 ORDER BY id DESC LIMIT 500', [ctx.tenantId])).rows);

    } catch (e) {

        if (e.code === '42P01' || e.code === '42703') return res.json([]);

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/lab/qc', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const ctx = lisRequireTenant(req, res); if (!ctx) return;

        const { analyzer, analyte, level, value, target, sd, reagent_lot } = req.body;

        const flag = lis.qcFlag(value, target, sd);

        const ins = await pool.query(

            `INSERT INTO lab_qc (tenant_id, facility_id, analyzer, analyte, level, value, target, sd, z, westgard_flag, breach, reagent_lot, entered_by)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,

            [ctx.tenantId, ctx.facilityId || null, analyzer || '', analyte || '', level || '',

             (value === undefined || value === '' ? null : value),

             (target === undefined || target === '' ? null : target),

             (sd === undefined || sd === '' ? null : sd),

             flag.z, flag.rule, flag.breach ? 1 : 0, reagent_lot || '', req.session.user?.id || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'LAB_QC_ENTER', 'Lab',

            `QC ${analyzer}/${analyte}/${level} value=${value} -> ${flag.rule}${flag.breach ? ' [BREACH]' : ''}`, req.ip);

        res.json({ qc: ins.rows[0], flag });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/lab/orders', requireAuth, async (req, res) => {

    try {

        // --- TENANT SCOPE: filter lab orders by current tenant_id ---

        const { tenantId } = getRequestTenantContext(req);

        const tenantFilter = tenantId ? ' AND o.tenant_id=$1' : '';

        const queryParams = tenantId ? [tenantId] : [];

        const rows = (await pool.query(`SELECT o.*, p.name_ar as patient_name, p.file_number, p.phone, su.display_name as doctor

            FROM lab_radiology_orders o LEFT JOIN patients p ON o.patient_id = p.id

            LEFT JOIN system_users su ON o.doctor_id = su.id

            WHERE o.is_radiology = 0 AND o.approval_status IN ('Approved', 'Paid')${tenantFilter}

            ORDER BY o.id DESC`, queryParams)).rows;

        res.json(rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/lab/orders', requireAuth, async (req, res) => {

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

             VALUES ($1, $2, $3, $4, 'Pending Payment', 0, 'Pending Approval', $5, $6) RETURNING *`,

            [patient_id, req.session.user?.id || 0, order_type || '', description || '', tenantId || null, facilityId || null]

        );

        r.rows[0].patient_name = pName?.name_ar || pName?.name_en || '';

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_LAB_ORDER', 'Lab',

            `Lab order: ${order_type} for patient #${patient_id}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/lab/orders/direct', requireAuth, async (req, res) => {

    try {

        const { patient_id, order_type, description } = req.body;

        // --- TENANT SCOPE: stamp tenant_id from session ---

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (tenantId && patient_id) {

            const patientCheck = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

            if (!patientCheck) return res.status(404).json({ error: 'Patient not found' });

        }

        const pName = patient_id ? (await pool.query('SELECT name_ar, name_en FROM patients WHERE id=$1', [patient_id])).rows[0] : null;

        const r = await pool.query(

            `INSERT INTO lab_radiology_orders (patient_id, doctor_id, order_type, description, status, is_radiology, approval_status, tenant_id, facility_id)

             VALUES ($1, $2, $3, $4, 'Requested', 0, 'Paid', $5, $6) RETURNING *`,

            [patient_id || 0, req.session.user?.id || 0, order_type || '', description || '', tenantId || null, facilityId || null]

        );

        r.rows[0].patient_name = pName?.name_ar || pName?.name_en || '';

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_LAB_ORDER_DIRECT', 'Lab',

            `Direct lab order: ${order_type} for patient #${patient_id}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/lab/orders/:id', requireAuth, async (req, res) => {

    try {

        const { status, results } = req.body;

        // --- TENANT SCOPE: verify order belongs to current tenant before update (IDOR prevention) ---

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const orderCheck = (await pool.query(`SELECT id FROM lab_radiology_orders WHERE id=$1${tenantCheck}`, tenantParams)).rows[0];

        if (!orderCheck) return res.status(404).json({ error: 'Order not found' });

        const sets = []; const vals = []; let i = 1;

        if (status) { sets.push(`status=$${i++}`); vals.push(status); }

        if (results !== undefined) { sets.push(`results=$${i++}`); vals.push(results); }

        if (status === 'Done') { sets.push(`result_date=$${i++}`); vals.push(new Date().toISOString()); }

        if (sets.length > 0) {

            vals.push(req.params.id);

            await pool.query(`UPDATE lab_radiology_orders SET ${sets.join(',')} WHERE id=$${i}`, vals);

        }

        logAudit(req.session.user?.id, req.session.user?.display_name, 'UPDATE_LAB_ORDER', 'Lab',

            `Updated lab order #${req.params.id} status:${status || '-'} results:${results !== undefined ? 'yes' : 'no'}`, req.ip);

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/lab/orders/:id', requireAuth, async (req, res) => {

    try {

        // --- TENANT SCOPE: verify order belongs to current tenant (IDOR prevention) ---

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND o.tenant_id=$2' : '';

        const tenantParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const r = (await pool.query(`SELECT o.*, p.name_ar as patient_name, p.file_number

            FROM lab_radiology_orders o LEFT JOIN patients p ON o.patient_id = p.id WHERE o.id=$1${tenantCheck}`, tenantParams)).rows[0];

        if (!r) return res.status(404).json({ error: 'Order not found' });

        res.json(r);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/lab/reference-ranges', requireAuth, async (req, res) => {

    try {

        const ranges = {

            'CBC': {

                'WBC': { unit: '10^3/uL', male: '4.5-11.0', female: '4.5-11.0', low: 4.5, high: 11.0 },

                'RBC': { unit: '10^6/uL', male: '4.7-6.1', female: '4.2-5.4', low: 4.2, high: 6.1 },

                'Hemoglobin': { unit: 'g/dL', male: '13.5-17.5', female: '12.0-16.0', low: 12.0, high: 17.5 },

                'Hematocrit': { unit: '%', male: '38.3-48.6', female: '35.5-44.9', low: 35.5, high: 48.6 },

                'Platelets': { unit: '10^3/uL', male: '150-400', female: '150-400', low: 150, high: 400 },

                'MCV': { unit: 'fL', male: '80-100', female: '80-100', low: 80, high: 100 },

                'MCH': { unit: 'pg', male: '27-33', female: '27-33', low: 27, high: 33 },

                'MCHC': { unit: 'g/dL', male: '32-36', female: '32-36', low: 32, high: 36 },

                'RDW': { unit: '%', male: '11.5-14.5', female: '11.5-14.5', low: 11.5, high: 14.5 },

                'Neutrophils': { unit: '%', male: '40-70', female: '40-70', low: 40, high: 70 },

                'Lymphocytes': { unit: '%', male: '20-40', female: '20-40', low: 20, high: 40 },

                'Monocytes': { unit: '%', male: '2-8', female: '2-8', low: 2, high: 8 },

                'Eosinophils': { unit: '%', male: '1-4', female: '1-4', low: 1, high: 4 },

                'Basophils': { unit: '%', male: '0-1', female: '0-1', low: 0, high: 1 },

                'ESR': { unit: 'mm/hr', male: '0-15', female: '0-20', low: 0, high: 20 },

            },

            'Chemistry': {

                'Glucose (Fasting)': { unit: 'mg/dL', male: '70-100', female: '70-100', low: 70, high: 100 },

                'Glucose (Random)': { unit: 'mg/dL', male: '70-140', female: '70-140', low: 70, high: 140 },

                'HbA1c': { unit: '%', male: '4.0-5.6', female: '4.0-5.6', low: 4.0, high: 5.6 },

                'BUN': { unit: 'mg/dL', male: '7-20', female: '7-20', low: 7, high: 20 },

                'Creatinine': { unit: 'mg/dL', male: '0.7-1.3', female: '0.6-1.1', low: 0.6, high: 1.3 },

                'Uric Acid': { unit: 'mg/dL', male: '3.4-7.0', female: '2.4-6.0', low: 2.4, high: 7.0 },

                'Total Cholesterol': { unit: 'mg/dL', male: '<200', female: '<200', low: 0, high: 200 },

                'LDL': { unit: 'mg/dL', male: '<100', female: '<100', low: 0, high: 100 },

                'HDL': { unit: 'mg/dL', male: '>40', female: '>50', low: 40, high: 999 },

                'Triglycerides': { unit: 'mg/dL', male: '<150', female: '<150', low: 0, high: 150 },

                'AST (SGOT)': { unit: 'U/L', male: '10-40', female: '10-35', low: 10, high: 40 },

                'ALT (SGPT)': { unit: 'U/L', male: '7-56', female: '7-45', low: 7, high: 56 },

                'ALP': { unit: 'U/L', male: '44-147', female: '44-147', low: 44, high: 147 },

                'GGT': { unit: 'U/L', male: '9-48', female: '9-36', low: 9, high: 48 },

                'Total Bilirubin': { unit: 'mg/dL', male: '0.1-1.2', female: '0.1-1.2', low: 0.1, high: 1.2 },

                'Direct Bilirubin': { unit: 'mg/dL', male: '0-0.3', female: '0-0.3', low: 0, high: 0.3 },

                'Total Protein': { unit: 'g/dL', male: '6.0-8.3', female: '6.0-8.3', low: 6.0, high: 8.3 },

                'Albumin': { unit: 'g/dL', male: '3.5-5.5', female: '3.5-5.5', low: 3.5, high: 5.5 },

                'Calcium': { unit: 'mg/dL', male: '8.5-10.5', female: '8.5-10.5', low: 8.5, high: 10.5 },

                'Phosphorus': { unit: 'mg/dL', male: '2.5-4.5', female: '2.5-4.5', low: 2.5, high: 4.5 },

                'Magnesium': { unit: 'mg/dL', male: '1.7-2.2', female: '1.7-2.2', low: 1.7, high: 2.2 },

                'Sodium': { unit: 'mEq/L', male: '136-145', female: '136-145', low: 136, high: 145 },

                'Potassium': { unit: 'mEq/L', male: '3.5-5.0', female: '3.5-5.0', low: 3.5, high: 5.0 },

                'Chloride': { unit: 'mEq/L', male: '98-106', female: '98-106', low: 98, high: 106 },

                'Iron': { unit: 'ug/dL', male: '60-170', female: '50-170', low: 50, high: 170 },

                'Ferritin': { unit: 'ng/mL', male: '20-300', female: '10-150', low: 10, high: 300 },

                'TIBC': { unit: 'ug/dL', male: '250-370', female: '250-370', low: 250, high: 370 },

                'Vitamin D': { unit: 'ng/mL', male: '30-100', female: '30-100', low: 30, high: 100 },

                'Vitamin B12': { unit: 'pg/mL', male: '200-900', female: '200-900', low: 200, high: 900 },

                'Folate': { unit: 'ng/mL', male: '3-17', female: '3-17', low: 3, high: 17 },

                'LDH': { unit: 'U/L', male: '140-280', female: '140-280', low: 140, high: 280 },

                'CRP': { unit: 'mg/L', male: '<10', female: '<10', low: 0, high: 10 },

                'Amylase': { unit: 'U/L', male: '28-100', female: '28-100', low: 28, high: 100 },

                'Lipase': { unit: 'U/L', male: '0-160', female: '0-160', low: 0, high: 160 },

            },

            'Thyroid': {

                'TSH': { unit: 'mIU/L', male: '0.4-4.0', female: '0.4-4.0', low: 0.4, high: 4.0 },

                'Free T3': { unit: 'pg/mL', male: '2.0-4.4', female: '2.0-4.4', low: 2.0, high: 4.4 },

                'Free T4': { unit: 'ng/dL', male: '0.8-1.8', female: '0.8-1.8', low: 0.8, high: 1.8 },

            },

            'Coagulation': {

                'PT': { unit: 'seconds', male: '11-13.5', female: '11-13.5', low: 11, high: 13.5 },

                'INR': { unit: '', male: '0.9-1.1', female: '0.9-1.1', low: 0.9, high: 1.1 },

                'aPTT': { unit: 'seconds', male: '25-35', female: '25-35', low: 25, high: 35 },

                'D-Dimer': { unit: 'ng/mL', male: '<500', female: '<500', low: 0, high: 500 },

                'Fibrinogen': { unit: 'mg/dL', male: '200-400', female: '200-400', low: 200, high: 400 },

            },

            'Urinalysis': {

                'pH': { unit: '', male: '4.5-8.0', female: '4.5-8.0', low: 4.5, high: 8.0 },

                'Specific Gravity': { unit: '', male: '1.005-1.030', female: '1.005-1.030', low: 1.005, high: 1.030 },

                'Glucose': { unit: '', male: 'Negative', female: 'Negative', low: 0, high: 0 },

                'Protein': { unit: '', male: 'Negative', female: 'Negative', low: 0, high: 0 },

                'Blood': { unit: '', male: 'Negative', female: 'Negative', low: 0, high: 0 },

                'WBC': { unit: '/HPF', male: '0-5', female: '0-5', low: 0, high: 5 },

                'RBC': { unit: '/HPF', male: '0-2', female: '0-2', low: 0, high: 2 },

            },

            'Hormones': {

                'Prolactin': { unit: 'ng/mL', male: '2-18', female: '2-29', low: 2, high: 29 },

                'FSH': { unit: 'mIU/mL', male: '1.5-12.4', female: '3.5-12.5', low: 1.5, high: 12.5 },

                'LH': { unit: 'mIU/mL', male: '1.7-8.6', female: '2.4-12.6', low: 1.7, high: 12.6 },

                'Testosterone': { unit: 'ng/dL', male: '270-1070', female: '15-70', low: 15, high: 1070 },

                'Estradiol': { unit: 'pg/mL', male: '10-40', female: '15-350', low: 10, high: 350 },

                'Cortisol (AM)': { unit: 'ug/dL', male: '6-23', female: '6-23', low: 6, high: 23 },

                'PSA': { unit: 'ng/mL', male: '0-4.0', female: '-', low: 0, high: 4.0 },

                'HCG': { unit: 'mIU/mL', male: '<5', female: '<5 (non-pregnant)', low: 0, high: 5 },

            },

            'Cardiac': {

                'Troponin I': { unit: 'ng/mL', male: '<0.04', female: '<0.04', low: 0, high: 0.04 },

                'CK-MB': { unit: 'ng/mL', male: '0-5', female: '0-5', low: 0, high: 5 },

                'BNP': { unit: 'pg/mL', male: '<100', female: '<100', low: 0, high: 100 },

                'Procalcitonin': { unit: 'ng/mL', male: '<0.1', female: '<0.1', low: 0, high: 0.1 },

            },

        };

        res.json(ranges);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/lab/microbiology/:patientId', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const pid = parseInt(req.params.patientId);

        

        const pat = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [pid, tid]);

        if (!pat.rows.length) return res.status(403).json({ error: 'Patient access denied' });

        

        const rows = await pool.query('SELECT * FROM lab_microbiology WHERE patient_id=$1 AND tenant_id=$2 ORDER BY collection_date DESC, id DESC', [pid, tid]);

        res.json(rows.rows);

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.post('/api/lab/microbiology', requireAuth, requireRole('lab_technician', 'lab', 'admin'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { order_id, patient_id, admission_id, specimen_type, collection_date, collection_time, collection_site, gram_stain, preliminary_result, final_result, organism_identified, colony_count, sensitivity_results = [], antibiogram_profile, report_status = 'Final', critical_value = false, critical_notified_to, loinc_code } = req.body;

        if (!patient_id) return res.status(400).json({ error: 'patient_id required' });

        

        // IDOR check

        const pat = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [parseInt(patient_id), tid]);

        if (!pat.rows.length) return res.status(403).json({ error: 'Patient access denied' });

        

        const r = await pool.query(

            `INSERT INTO lab_microbiology 

                (order_id, patient_id, admission_id, specimen_type, collection_date, collection_time, collection_site, gram_stain, preliminary_result, final_result, organism_identified, colony_count, sensitivity_results, antibiogram_profile, report_status, reported_by, reported_at, verified_by, verified_at, critical_value, critical_notified_to, critical_notified_at, loinc_code, tenant_id)

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), $16, NOW(), $17, $18, $19, $20, $21) RETURNING *`,

            [order_id ? parseInt(order_id) : null, parseInt(patient_id), admission_id ? parseInt(admission_id) : null, specimen_type || 'Blood', collection_date || new Date().toISOString().slice(0,10), collection_time || '12:00:00', collection_site || '', gram_stain || '', preliminary_result || '', final_result || '', organism_identified || '', colony_count || '', JSON.stringify(sensitivity_results), antibiogram_profile || '', report_status, 

             req.session.user.display_name, critical_value, critical_notified_to || '', critical_value ? new Date() : null, loinc_code || '', tid]

        );

        

        // Trigger alert system notification if critical value

        if (critical_value) {

            await pool.query(

                `INSERT INTO system_notifications (tenant_id, recipient_role, title, message, status)

                 VALUES ($1, 'doctor', $2, $3, 'unread')`,

                [tid, 'CRITICAL LAB VALUE ALERT (Microbiology)', `Patient#${patient_id} culture resulted in ${organism_identified || 'critical pathogen'}. Specimen: ${specimen_type}.`]

            );

        }

        

        logAudit(req.session.user.id, req.session.user.display_name, 'MICROBIOLOGY_REPORT', 'Lab', `Microbiology report finalized for Patient#${patient_id} organism: ${organism_identified}`, tid);

        res.json({ success: true, report: r.rows[0] });

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.get('/api/lab/loinc', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { query: searchQuery } = req.query;

        let q = 'SELECT * FROM lab_loinc_codes WHERE is_active=TRUE AND (tenant_id=$1 OR tenant_id=1)';

        const params = [tid];

        if (searchQuery) {

            params.push(`%${searchQuery}%`);

            q += ` AND (loinc_code ILIKE $2 OR short_name ILIKE $2 OR long_name ILIKE $2)`;

        }

        q += ' LIMIT 100';

        const rows = await pool.query(q, params);

        res.json(rows.rows);

    } catch (e) { res.status(500).json({ error: e.message }); }

});


    return router;
}
