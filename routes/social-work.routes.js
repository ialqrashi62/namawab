const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeSocialWorkRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.get('/api/social-work/cases', requireAuth, requireRole('him', 'nursing'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        res.json((await pool.query('SELECT * FROM social_work_cases WHERE tenant_id=$1 ORDER BY created_at DESC', [tenantId])).rows);
    }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/social-work/cases', requireAuth, requireRole('him', 'nursing'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId, facilityId } = getRequestTenantContext(req);
        const { patient_id, patient_name, case_type, assessment, plan, priority } = req.body;
        const result = await pool.query('INSERT INTO social_work_cases (patient_id, patient_name, case_type, social_worker, assessment, plan, priority, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
            [patient_id, patient_name || '', case_type || 'General', req.session.user.name, assessment || '', plan || '', priority || 'Medium', tenantId, facilityId]);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.put('/api/social-work/cases/:id', requireAuth, requireRole('him', 'nursing'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const { status, interventions, referrals, follow_up_date } = req.body;
        await pool.query('UPDATE social_work_cases SET status=$1, interventions=$2, referrals=$3, follow_up_date=$4 WHERE id=$5 AND tenant_id=$6',
            [status || 'Open', interventions || '', referrals || '', follow_up_date || '', req.params.id, tenantId]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

    return router;
}
