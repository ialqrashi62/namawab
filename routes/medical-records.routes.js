const crypto = require('crypto');
const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeMedicalRecordsRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.post('/api/medical-records/:id/sign', requireAuth, requireRole('doctor'), requireTenantScope, async (req, res) => {

    try {

        const crypto = require('crypto');

        const id = parseInt(req.params.id, 10);

        const { tenantId } = getRequestTenantContext(req);

        const actor = req.session.user;

        const cur = (await pool.query('SELECT diagnosis, symptoms, notes, emr_status FROM medical_records WHERE id=$1 AND tenant_id=$2', [id, tenantId])).rows[0];

        if (!cur) return res.status(404).json({ error: 'Record not found' });

        if (cur.emr_status === 'locked') return res.status(409).json({ error: 'Record already locked' });

        const hash = crypto.createHash('sha256').update(`${cur.diagnosis || ''}|${cur.symptoms || ''}|${cur.notes || ''}`).digest('hex');

        const r = await pool.query("UPDATE medical_records SET emr_status='locked', signed_by_user_id=$1, signed_at=now(), locked_at=now(), integrity_hash=$2 WHERE id=$3 AND tenant_id=$4 AND emr_status<>'locked'",

            [actor.id, hash, id, tenantId]);

        if (r.rowCount === 0) return res.status(409).json({ error: 'Record already locked or not found' });

        logAudit(actor.id, actor.display_name, 'SIGN_LOCK_RECORD', 'EMR', `Signed+locked medical_record #${id}`, req.ip);

        res.json({ success: true, id, emr_status: 'locked' });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/medical-records/:id/amend', requireAuth, requireRole('doctor'), requireTenantScope, async (req, res) => {

    try {

        const id = parseInt(req.params.id, 10);

        const { tenantId } = getRequestTenantContext(req);

        const actor = req.session.user;

        const { reason, new_values_summary } = req.body;

        if (!reason || !String(reason).trim()) return res.status(400).json({ error: 'Amendment reason required' });

        const cur = (await pool.query('SELECT integrity_hash, emr_status FROM medical_records WHERE id=$1 AND tenant_id=$2', [id, tenantId])).rows[0];

        if (!cur) return res.status(404).json({ error: 'Record not found' });

        if (cur.emr_status !== 'locked') return res.status(409).json({ error: 'Amendment applies only to locked records' });

        await pool.query('INSERT INTO emr_amendments (record_type, record_id, amended_by_user_id, reason, previous_integrity_hash, new_values_summary) VALUES ($1,$2,$3,$4,$5,$6)',

            ['medical_records', id, actor.id, String(reason), cur.integrity_hash, new_values_summary || '']);

        logAudit(actor.id, actor.display_name, 'AMEND_RECORD', 'EMR', `Amended locked medical_record #${id}: ${String(reason).slice(0, 120)}`, req.ip);

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/medical-records/:id/amendments', requireAuth, requireRole('doctor', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const id = parseInt(req.params.id, 10);

        const { tenantId } = getRequestTenantContext(req);

        // Verify parent record belongs to tenant

        const cur = (await pool.query('SELECT id FROM medical_records WHERE id=$1 AND tenant_id=$2', [id, tenantId])).rows[0];

        if (!cur) return res.status(404).json({ error: 'Record not found' });

        res.json((await pool.query('SELECT * FROM emr_amendments WHERE record_type=$1 AND record_id=$2 ORDER BY id DESC',

            ['medical_records', id])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/medical-records/files', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        res.json((await pool.query('SELECT * FROM medical_records_files WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/medical-records/requests', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        res.json((await pool.query('SELECT * FROM medical_records_requests WHERE tenant_id=$1 ORDER BY requested_at DESC', [tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/medical-records/requests', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { patient_id, file_number, department, purpose, notes } = req.body;

        const { tenantId } = getRequestTenantContext(req);

        const result = await pool.query('INSERT INTO medical_records_requests (patient_id, file_number, requested_by, department, purpose, notes, tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',

            [patient_id, file_number, req.session.user.name, department || '', purpose || 'Clinic Visit', notes || '', tenantId]);

        logAudit(req.session.user.id, req.session.user.name, 'REQUEST_FILE', 'Medical Records', `File ${file_number} requested`, req.ip);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/medical-records/requests/:id', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { status } = req.body;

        const { tenantId } = getRequestTenantContext(req);

        const now = new Date().toISOString();

        let r;

        if (status === 'Delivered') {

            r = await pool.query('UPDATE medical_records_requests SET status=$1, delivered_at=$2 WHERE id=$3 AND tenant_id=$4', [status, now, req.params.id, tenantId]);

        } else if (status === 'Returned') {

            r = await pool.query('UPDATE medical_records_requests SET status=$1, returned_at=$2 WHERE id=$3 AND tenant_id=$4', [status, now, req.params.id, tenantId]);

        } else {

            r = await pool.query('UPDATE medical_records_requests SET status=$1 WHERE id=$2 AND tenant_id=$3', [status, req.params.id, tenantId]);

        }

        if (!r.rowCount) return res.status(404).json({ error: 'Request not found' });

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/medical-records/coding', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        res.json((await pool.query('SELECT * FROM medical_records_coding WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/medical-records/coding', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { patient_id, visit_id, primary_diagnosis, primary_icd10, secondary_diagnoses, drg_code, notes } = req.body;

        const { tenantId } = getRequestTenantContext(req);

        const result = await pool.query('INSERT INTO medical_records_coding (patient_id, visit_id, primary_diagnosis, primary_icd10, secondary_diagnoses, drg_code, coder, coding_date, status, tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',

            [patient_id, visit_id || 0, primary_diagnosis || '', primary_icd10 || '', secondary_diagnoses || '', drg_code || '', req.session.user.name, new Date().toISOString().split('T')[0], 'Coded', tenantId]);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/medical-records/patient/:patientId', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        // Verify patient belongs to tenant

        const p = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [req.params.patientId, tenantId])).rows[0];

        if (!p) return res.status(404).json({ error: 'Patient not found' });



        const records = (await pool.query("SELECT * FROM medical_records WHERE patient_id=$1 AND tenant_id=$2 ORDER BY created_at DESC", [req.params.patientId, tenantId])).rows;

        res.json(records);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
