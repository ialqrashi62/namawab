const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeRehabRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.get('/api/rehab/patients', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        res.json((await pool.query('SELECT * FROM rehab_patients WHERE tenant_id=$1 ORDER BY created_at DESC', [tenantId])).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/rehab/patients', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { patient_id, patient_name, diagnosis, referral_source, therapist, therapy_type, start_date, target_end_date, notes } = req.body;
        const { tenantId } = getRequestTenantContext(req);
        const result = await pool.query('INSERT INTO rehab_patients (patient_id, patient_name, diagnosis, referral_source, therapist, therapy_type, start_date, target_end_date, notes, tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
            [patient_id, patient_name || '', diagnosis || '', referral_source || '', therapist || '', therapy_type || 'Physical Therapy', start_date || new Date().toISOString().split('T')[0], target_end_date || '', notes || '', tenantId]);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/rehab/sessions', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { patient_id } = req.query;
        const { tenantId } = getRequestTenantContext(req);
        if (patient_id) res.json((await pool.query('SELECT * FROM rehab_sessions WHERE rehab_patient_id=$1 AND tenant_id=$2 ORDER BY session_number DESC', [patient_id, tenantId])).rows);
        else res.json((await pool.query('SELECT * FROM rehab_sessions WHERE tenant_id=$1 ORDER BY created_at DESC LIMIT 100', [tenantId])).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/rehab/sessions', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { rehab_patient_id, patient_id, session_number, therapist, session_type, exercises, duration_minutes, pain_before, pain_after, progress_notes } = req.body;
        const { tenantId } = getRequestTenantContext(req);
        const result = await pool.query('INSERT INTO rehab_sessions (rehab_patient_id, patient_id, session_date, session_number, therapist, session_type, exercises, duration_minutes, pain_before, pain_after, progress_notes, tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *',
            [rehab_patient_id, patient_id || 0, new Date().toISOString().split('T')[0], session_number || 1, therapist || req.session.user.name, session_type || 'Individual', exercises || '', duration_minutes || 30, pain_before || 0, pain_after || 0, progress_notes || '', tenantId]);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/rehab/goals', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { patient_id } = req.query;
        const { tenantId } = getRequestTenantContext(req);
        if (patient_id) res.json((await pool.query('SELECT * FROM rehab_goals WHERE rehab_patient_id=$1 AND tenant_id=$2 ORDER BY id', [patient_id, tenantId])).rows);
        else res.json((await pool.query('SELECT * FROM rehab_goals WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/rehab/goals', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { rehab_patient_id, goal_description, target_date } = req.body;
        const { tenantId } = getRequestTenantContext(req);
        const result = await pool.query('INSERT INTO rehab_goals (rehab_patient_id, goal_description, target_date, tenant_id) VALUES ($1,$2,$3,$4) RETURNING *',
            [rehab_patient_id, goal_description || '', target_date || '', tenantId]);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.put('/api/rehab/goals/:id', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { progress, status } = req.body;
        const { tenantId } = getRequestTenantContext(req);
        const r = await pool.query('UPDATE rehab_goals SET progress=$1, status=$2 WHERE id=$3 AND tenant_id=$4', [progress || 0, status || 'In Progress', req.params.id, tenantId]);
        if (!r.rowCount) return res.status(404).json({ error: 'Goal not found' });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/rehab/assessments', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { patient_id } = req.query;
        const { tenantId } = getRequestTenantContext(req);
        if (patient_id) {
            res.json((await pool.query('SELECT * FROM rehab_assessments WHERE patient_id=$1 AND tenant_id=$2 ORDER BY created_at DESC', [patient_id, tenantId])).rows);
        } else {
            res.json((await pool.query('SELECT * FROM rehab_assessments WHERE tenant_id=$1 ORDER BY created_at DESC LIMIT 100', [tenantId])).rows);
        }
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/rehab/assessments', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { rehab_patient_id, patient_id, assessment_type, rom_scores, strength_scores, functional_scores, balance_scores, pain_level, assessor } = req.body;
        const { tenantId } = getRequestTenantContext(req);
        const result = await pool.query(
            'INSERT INTO rehab_assessments (rehab_patient_id, patient_id, assessment_type, rom_scores, strength_scores, functional_scores, balance_scores, pain_level, assessor, tenant_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [rehab_patient_id || null, patient_id || 0, assessment_type || '', rom_scores || '', strength_scores || '', functional_scores || '', balance_scores || '', pain_level || 0, assessor || req.session.user.name, tenantId]
        );
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

    return router;
}
