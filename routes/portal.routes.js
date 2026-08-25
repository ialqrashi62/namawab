const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makePortalRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, bcrypt }) {
    const router = express.Router();
router.get('/api/portal/users', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        // IDOR fix: only portal users whose patient belongs to the caller's tenant (JOIN, not LEFT JOIN).

        res.json((await pool.query('SELECT pu.*, p.name_ar, p.name_en, p.file_number FROM portal_users pu JOIN patients p ON pu.patient_id=p.id WHERE p.tenant_id=$1 ORDER BY pu.id DESC', [tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/portal/users', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { patient_id, username, password, email, phone } = req.body;

        // IDOR: the patient must belong to the caller's tenant.

        if (patient_id) {

            const pOwn = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

            if (!pOwn) return res.status(404).json({ error: 'Patient not found' });

        }

        if (password) {

            const passCheck = validatePasswordPolicy(password, { username, email, phone });

            if (!passCheck.valid) {

                return res.status(400).json({ error: passCheck.error, error_ar: passCheck.error_ar });

            }

        }

        const bcrypt = require('bcryptjs');

        // Never default to a guessable password; generate a strong random one if none supplied (portal onboarding sets a real one).

        const initPw = password || require('crypto').randomBytes(18).toString('base64');

        const hash = await bcrypt.hash(initPw, 10);

        const result = await pool.query('INSERT INTO portal_users (patient_id, username, password_hash, email, phone) VALUES ($1,$2,$3,$4,$5) RETURNING *',

            [patient_id, username || '', hash, email || '', phone || '']);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/portal/appointments', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        // IDOR fix: only appointments whose patient belongs to the caller's tenant.

        res.json((await pool.query('SELECT pa.* FROM portal_appointments pa JOIN patients p ON pa.patient_id=p.id WHERE p.tenant_id=$1 ORDER BY pa.created_at DESC', [tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/portal/appointments/:id', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { status } = req.body;

        // IDOR write fix: only update an appointment whose patient belongs to the caller's tenant.

        const upd = await pool.query('UPDATE portal_appointments SET status=$1 WHERE id=$2 AND patient_id IN (SELECT id FROM patients WHERE tenant_id=$3)', [status, req.params.id, tenantId]);

        if (upd.rowCount === 0) return res.status(404).json({ error: 'Appointment not found' });

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/portal/lab-results', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { patient_id } = req.query;

        if (!patient_id) return res.status(400).json({ error: 'patient_id required' });

        // IDOR: verify patient belongs to tenant

        const pOwn = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

        if (!pOwn) return res.status(404).json({ error: 'Patient not found' });

        const results = (await pool.query(

            `SELECT lr.id, lr.test_name, lr.result_value, lr.reference_range, lr.unit, lr.status,

                    lr.critical_flag, lr.verified_by, lr.verified_at, lr.created_at,

                    lo.order_date, lo.priority, lo.notes

             FROM lab_results lr

             JOIN lab_radiology_orders lo ON lr.order_id = lo.id

             WHERE lo.patient_id=$1 AND lo.tenant_id=$2 AND lr.status IN ('Verified','Final')

             ORDER BY lr.created_at DESC LIMIT 100`,

            [patient_id, tenantId]

        )).rows;

        logAudit(req.session.user.id, req.session.user.name, 'PORTAL_VIEW_LAB_RESULTS', 'Patient Portal',

            `Patient #${patient_id} lab results viewed`, req.ip);

        res.json(results);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/portal/medications', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { patient_id } = req.query;

        if (!patient_id) return res.status(400).json({ error: 'patient_id required' });

        const pOwn = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

        if (!pOwn) return res.status(404).json({ error: 'Patient not found' });

        // Active prescriptions from pharmacy queue

        const meds = (await pool.query(

            `SELECT pq.id, pq.medication_name, pq.dosage, pq.frequency, pq.duration_days,

                    pq.route, pq.instructions, pq.status, pq.prescribed_by, pq.prescribed_date,

                    pq.dispensed_at, pq.dispensed_by

             FROM pharmacy_prescriptions_queue pq

             WHERE pq.patient_id=$1 AND pq.tenant_id=$2 AND pq.status IN ('Dispensed','Pending','Verified')

             ORDER BY pq.prescribed_date DESC LIMIT 50`,

            [patient_id, tenantId]

        )).rows;

        logAudit(req.session.user.id, req.session.user.name, 'PORTAL_VIEW_MEDICATIONS', 'Patient Portal',

            `Patient #${patient_id} medications viewed`, req.ip);

        res.json(meds);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/portal/visit-summary', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { patient_id } = req.query;

        if (!patient_id) return res.status(400).json({ error: 'patient_id required' });

        const pOwn = (await pool.query('SELECT id, name_ar, name_en, file_number, dob, gender FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

        if (!pOwn) return res.status(404).json({ error: 'Patient not found' });

        // Recent visits/encounters

        const visits = (await pool.query(

            `SELECT v.id, v.visit_date, v.visit_type, v.chief_complaint, v.diagnosis, v.attending_doctor,

                    v.department, v.status, v.discharge_date, v.discharge_summary

             FROM visits v

             WHERE v.patient_id=$1 AND v.tenant_id=$2

             ORDER BY v.visit_date DESC LIMIT 20`,

            [patient_id, tenantId]

        )).rows;

        // Recent admissions

        const admissions = (await pool.query(

            `SELECT a.id, a.admission_date, a.discharge_date, a.diagnosis, a.attending_doctor,

                    a.ward_name, a.status, a.discharge_summary

             FROM admissions a

             WHERE a.patient_id=$1 AND a.tenant_id=$2

             ORDER BY a.admission_date DESC LIMIT 10`,

            [patient_id, tenantId]

        )).rows;

        logAudit(req.session.user.id, req.session.user.name, 'PORTAL_VIEW_VISIT_SUMMARY', 'Patient Portal',

            `Patient #${patient_id} visit summary viewed`, req.ip);

        res.json({ patient: pOwn, visits, admissions });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/portal/messages', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { patient_id } = req.query;

        if (!patient_id) return res.status(400).json({ error: 'patient_id required' });

        const pOwn = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

        if (!pOwn) return res.status(404).json({ error: 'Patient not found' });

        const msgs = (await pool.query(

            `SELECT pm.id, pm.sender_type, pm.sender_name, pm.subject, pm.body,

                    pm.is_read, pm.created_at, pm.replied_at

             FROM portal_messages pm

             WHERE pm.patient_id=$1 AND pm.tenant_id=$2

             ORDER BY pm.created_at DESC LIMIT 50`,

            [patient_id, tenantId]

        )).rows;

        res.json(msgs);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/portal/messages', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const { patient_id, subject, body, department } = req.body;

        if (!patient_id || !body) return res.status(400).json({ error: 'patient_id and body required' });

        const pOwn = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

        if (!pOwn) return res.status(404).json({ error: 'Patient not found' });

        const result = await pool.query(

            `INSERT INTO portal_messages (patient_id, sender_type, sender_name, subject, body, department, is_read, tenant_id, facility_id, created_at)

             VALUES ($1, 'patient', (SELECT COALESCE(name_ar, name_en, 'مريض') FROM patients WHERE id=$1 AND tenant_id=$2), $3, $4, $5, false, $2, $6, NOW())

             RETURNING id`,

            [patient_id, tenantId, subject || 'رسالة من المريض', body, department || 'General', facilityId || null]

        );

        logAudit(req.session.user.id, req.session.user.name, 'PORTAL_PATIENT_MESSAGE', 'Patient Portal',

            `Patient #${patient_id} sent message: ${(subject||'').substring(0,50)}`, req.ip);

        res.json({ id: result.rows[0].id, success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
