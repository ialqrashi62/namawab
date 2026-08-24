const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeMedicalReportsRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.post('/api/medical-reports', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { patient_id, patient_name, report_type, diagnosis, icd_code, start_date, end_date, duration_days, notes, fitness_status } = req.body;
        const doctor = req.session.user?.display_name || '';
        const reportNum = 'MR-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6);
        const { tenantId } = getRequestTenantContext(req);

        // Verify patient context belongs to tenant
        if (tenantId && patient_id) {
            const patientCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId]);
            if (patientCheck.rows.length === 0) {
                return res.status(403).json({ error: 'Unauthorized patient context' });
            }
        }

        // medical_reports schema provisioned out-of-band (route_level_ddl_cleanup_candidate_*); no DDL in handler.
        const result = await pool.query(
            'INSERT INTO medical_reports (report_number, patient_id, patient_name, report_type, diagnosis, icd_code, start_date, end_date, duration_days, notes, fitness_status, doctor, tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *',
            [reportNum, patient_id, patient_name, report_type, diagnosis, icd_code, start_date, end_date, duration_days || 0, notes, fitness_status, doctor, tenantId]
        );

        logAudit(req.session.user?.id, doctor, 'CREATE_MEDICAL_REPORT', 'MedReport', reportNum + ' - ' + report_type, req.ip);
        res.json(result.rows[0]);
    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/medical-reports', requireAuth, requireTenantScope, async (req, res) => {
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

        let q = 'SELECT * FROM medical_reports';
        let p = [];
        const conds = [];
        if (tenantId) {
            conds.push('tenant_id=$' + (p.length + 1));
            p.push(tenantId);
        }
        if (patient_id) {
            conds.push('patient_id=$' + (p.length + 1));
            p.push(patient_id);
        }
        if (conds.length) q += ' WHERE ' + conds.join(' AND ');
        q += ' ORDER BY created_at DESC LIMIT 100';
        const rows = (await pool.query(q, p)).rows;
        res.json(rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/medical-reports/:id', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);

        const q = tenantId ?
            'SELECT * FROM medical_reports WHERE id=$1 AND tenant_id=$2' :
            'SELECT * FROM medical_reports WHERE id=$1';
        const params = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const row = (await pool.query(q, params)).rows[0];
        if (!row) return res.status(404).json({ error: 'Not found' });
        res.json(row);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

    return router;
}
