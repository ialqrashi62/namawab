const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeCosmeticRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.get('/api/cosmetic/procedures', requireAuth, requireRole('doctor', 'surgery'), requireTenantScope, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM cosmetic_procedures WHERE is_active=1 ORDER BY category, name_en')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/cosmetic/cases', requireAuth, requireRole('doctor', 'surgery'), requireTenantScope, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM cosmetic_cases ORDER BY created_at DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/cosmetic/cases', requireAuth, requireRole('doctor', 'surgery'), requireTenantScope, async (req, res) => {
    try {
        const { patient_id, patient_name, procedure_id, procedure_name, surgery_date, surgery_time, anesthesia_type, operating_room, total_cost, pre_op_notes } = req.body;
        const result = await pool.query('INSERT INTO cosmetic_cases (patient_id, patient_name, procedure_id, procedure_name, surgeon, surgery_date, surgery_time, anesthesia_type, operating_room, total_cost, pre_op_notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
            [patient_id, patient_name || '', procedure_id || 0, procedure_name || '', req.session.user.name, surgery_date || '', surgery_time || '', anesthesia_type || 'Local', operating_room || '', total_cost || 0, pre_op_notes || '']);
        logAudit(req.session.user.id, req.session.user.name, 'COSMETIC_CASE', 'Cosmetic Surgery', `New case: ${procedure_name} for ${patient_name}`, req.ip);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.put('/api/cosmetic/cases/:id', requireAuth, requireRole('doctor', 'surgery'), requireTenantScope, async (req, res) => {
    try {
        const { status, operative_notes, post_op_notes, complications, duration_minutes } = req.body;
        await pool.query('UPDATE cosmetic_cases SET status=$1, operative_notes=$2, post_op_notes=$3, complications=$4, duration_minutes=$5 WHERE id=$6',
            [status || 'Completed', operative_notes || '', post_op_notes || '', complications || '', duration_minutes || 0, req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/cosmetic/consents', requireAuth, requireRole('doctor', 'surgery'), requireTenantScope, async (req, res) => {
    try {
        const { case_id } = req.query;
        if (case_id) res.json((await pool.query('SELECT * FROM cosmetic_consents WHERE case_id=$1 ORDER BY created_at DESC', [case_id])).rows);
        else res.json((await pool.query('SELECT * FROM cosmetic_consents ORDER BY created_at DESC')).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/cosmetic/consents', requireAuth, requireRole('doctor', 'surgery'), requireTenantScope, async (req, res) => {
    try {
        const { case_id, patient_id, patient_name, procedure_name, consent_type, risks_explained, alternatives_explained, expected_results, limitations, patient_questions, is_photography_consent, is_anesthesia_consent, is_blood_transfusion_consent, witness_name } = req.body;
        const now = new Date();
        const result = await pool.query('INSERT INTO cosmetic_consents (case_id, patient_id, patient_name, procedure_name, consent_type, surgeon, risks_explained, alternatives_explained, expected_results, limitations, patient_questions, is_photography_consent, is_anesthesia_consent, is_blood_transfusion_consent, witness_name, consent_date, consent_time, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *',
            [case_id || 0, patient_id, patient_name || '', procedure_name || '', consent_type || 'Surgery', req.session.user.name, risks_explained || '', alternatives_explained || '', expected_results || '', limitations || '', patient_questions || '', is_photography_consent ? 1 : 0, is_anesthesia_consent ? 1 : 0, is_blood_transfusion_consent ? 1 : 0, witness_name || '', now.toISOString().split('T')[0], now.toTimeString().substring(0, 5), 'Signed']);
        logAudit(req.session.user.id, req.session.user.name, 'CONSENT_SIGNED', 'Cosmetic Surgery', `Consent for ${procedure_name} - patient ${patient_name}`, req.ip);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/cosmetic/followups', requireAuth, requireRole('doctor', 'surgery'), requireTenantScope, async (req, res) => {
    try {
        const { case_id } = req.query;
        if (case_id) res.json((await pool.query('SELECT * FROM cosmetic_followups WHERE case_id=$1 ORDER BY followup_date DESC', [case_id])).rows);
        else res.json((await pool.query('SELECT * FROM cosmetic_followups ORDER BY followup_date DESC')).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/cosmetic/followups', requireAuth, requireRole('doctor', 'surgery'), requireTenantScope, async (req, res) => {
    try {
        const { case_id, patient_id, patient_name, followup_date, days_post_op, healing_status, pain_level, swelling, complications, patient_satisfaction, surgeon_notes, next_followup } = req.body;
        const result = await pool.query('INSERT INTO cosmetic_followups (case_id, patient_id, patient_name, followup_date, days_post_op, healing_status, pain_level, swelling, complications, patient_satisfaction, surgeon_notes, next_followup, surgeon) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *',
            [case_id || 0, patient_id, patient_name || '', followup_date || new Date().toISOString().split('T')[0], days_post_op || 0, healing_status || 'Good', pain_level || 0, swelling || 'Mild', complications || '', patient_satisfaction || 0, surgeon_notes || '', next_followup || '', req.session.user.name]);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

    return router;
}
