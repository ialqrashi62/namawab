const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeReferralsRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.get('/api/referrals', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { patient_id } = req.query;
        const { tenantId } = getRequestTenantContext(req);

        // Verify patient context belongs to tenant if patient_id is passed
        if (tenantId && patient_id) {
            const patientCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId]);
            if (patientCheck.rows.length === 0) {
                return res.status(403).json({ error: 'Unauthorized patient context' });
            }
        }

        let query = 'SELECT * FROM patient_referrals';
        let params = [];
        let conds = [];
        if (tenantId) {
            conds.push('tenant_id=$' + (params.length + 1));
            params.push(tenantId);
        }
        if (patient_id) {
            conds.push('patient_id=$' + (params.length + 1));
            params.push(patient_id);
        }
        if (conds.length) query += ' WHERE ' + conds.join(' AND ');
        query += ' ORDER BY id DESC';

        res.json((await pool.query(query, params)).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/referrals', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { patient_id, patient_name, to_department, to_doctor, reason, urgency, notes } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);

        // Verify patient context belongs to tenant
        if (tenantId && patient_id) {
            const patientCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId]);
            if (patientCheck.rows.length === 0) {
                return res.status(403).json({ error: 'Unauthorized patient context' });
            }
        }

        const fromDoctor = req.session.user?.display_name || req.session.user?.name || '';
        const fromDoctorId = req.session.user?.id || 0;
        const result = await pool.query(
            'INSERT INTO patient_referrals (patient_id, patient_name, from_doctor_id, from_doctor, to_department, to_doctor, reason, urgency, notes, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id',
            [patient_id, patient_name || '', fromDoctorId, fromDoctor, to_department || '', to_doctor || '', reason || '', urgency || 'Normal', notes || '', tenantId, facilityId]);
        res.json((await pool.query('SELECT * FROM patient_referrals WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.put('/api/referrals/:id', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { status } = req.body;
        const { tenantId } = getRequestTenantContext(req);

        const q = tenantId ?
            'UPDATE patient_referrals SET status=$1 WHERE id=$2 AND tenant_id=$3 RETURNING *' :
            'UPDATE patient_referrals SET status=$1 WHERE id=$2 RETURNING *';
        const params = tenantId ? [status, req.params.id, tenantId] : [status, req.params.id];

        const r = await pool.query(q, params);
        if (r.rows.length === 0) return res.status(404).json({ error: 'Not found or unauthorized' });
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/referrals', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { patient_id, patient_name, from_doctor, from_dept, to_dept, to_doctor, reason, urgency, notes } = req.body;
        const { tenantId } = getRequestTenantContext(req);

        // Verify patient context belongs to tenant
        if (tenantId && patient_id) {
            const patientCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId]);
            if (patientCheck.rows.length === 0) {
                return res.status(403).json({ error: 'Unauthorized patient context' });
            }
        }

        // referrals schema provisioned out-of-band (route_level_ddl_cleanup_candidate_*); no DDL in handler.
        const result = await pool.query('INSERT INTO referrals (patient_id, patient_name, from_doctor, from_dept, to_dept, to_doctor, reason, urgency, notes, tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
            [patient_id, patient_name || '', from_doctor || req.session.user?.display_name || '', from_dept || '', to_dept || '', to_doctor || '', reason || '', urgency || 'Routine', notes || '', tenantId]);
        await pool.query('INSERT INTO notifications (target_role, title, message, type, module) VALUES ($1,$2,$3,$4,$5)',
            ['Doctor', 'New Referral', 'Patient: ' + patient_name + ' referred to ' + to_dept + ' - ' + reason, 'info', 'Referrals']);
        logAudit(req.session.user?.id, req.session.user?.display_name, 'REFERRAL', 'Doctor', 'Referred ' + patient_name + ' to ' + to_dept, req.ip);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/referrals', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);

        // referrals schema provisioned out-of-band (route_level_ddl_cleanup_candidate_*); no DDL in handler.
        const { patient_id } = req.query;

        // Verify patient context belongs to tenant if patient_id is passed
        if (tenantId && patient_id) {
            const patientCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId]);
            if (patientCheck.rows.length === 0) {
                return res.status(403).json({ error: 'Unauthorized patient context' });
            }
        }

        let query = 'SELECT * FROM referrals';
        let params = [];
        let conds = [];
        if (tenantId) {
            conds.push('tenant_id=$' + (params.length + 1));
            params.push(tenantId);
        }
        if (patient_id) {
            conds.push('patient_id=$' + (params.length + 1));
            params.push(patient_id);
        }
        if (conds.length) query += ' WHERE ' + conds.join(' AND ');
        query += ' ORDER BY created_at DESC LIMIT 100';

        res.json((await pool.query(query, params)).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

    return router;
}
