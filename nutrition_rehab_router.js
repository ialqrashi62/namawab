// filepath: namaweb/nutrition_rehab_router.js
// Nutrition + Diet orders + Rehabilitation + Social work.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Nutrition assessments
router.get('/nutrition/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'dietitian', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, assessment_date, height_cm, weight_kg, bmi, bmi_category, ideal_body_weight,
                   caloric_needs, protein_needs, screening_score, malnutrition_risk, plan, assessed_by, created_at
            FROM nutrition_assessments WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY assessment_date DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/nr/nutrition', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/nutrition', requireAuth, requireTenantScope, requireRole('dietitian', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, assessment_date, height_cm, weight_kg, bmi, bmi_category, ideal_body_weight, caloric_needs, protein_needs, screening_score, malnutrition_risk, plan } = req.body;
        if (!patient_id || !assessment_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO nutrition_assessments (tenant_id, patient_id, assessment_date, height_cm, weight_kg, bmi, bmi_category, ideal_body_weight, caloric_needs, protein_needs, screening_score, malnutrition_risk, plan, assessed_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id
        `, [req.tenantId, patient_id, assessment_date, height_cm || null, weight_kg || null, bmi || null, bmi_category || '', ideal_body_weight || null, caloric_needs || null, protein_needs || null, screening_score || null, malnutrition_risk || '', plan || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/nr/nutrition', err); res.status(500).json({ error: 'internal_error' }); }
});

// Diet orders
router.get('/diet-orders', requireAuth, requireTenantScope, requireRole('doctor', 'dietitian', 'nurse', 'admin'), async (req, res) => {
    try {
        const { admission_id, status, diet_type } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (admission_id) { params.push(admission_id); conditions.push(`admission_id = $${params.length}`); }
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (diet_type) { params.push(diet_type); conditions.push(`diet_type = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, admission_id, patient_id, patient_name, diet_type, diet_type_ar, texture,
                   fluid, allergies, restrictions, supplements, ordered_by, meal_preferences, start_date, end_date, status, created_at
            FROM diet_orders WHERE ${conditions.join(' AND ')}
            ORDER BY start_date DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, orders: r.rows });
    } catch (err) { console.error('GET /api/nr/diet-orders', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/diet-orders', requireAuth, requireTenantScope, requireRole('doctor', 'dietitian'), async (req, res) => {
    try {
        const { admission_id, patient_id, patient_name, diet_type, diet_type_ar, texture, fluid, allergies, restrictions, supplements, meal_preferences, start_date, end_date } = req.body;
        if (!patient_id || !diet_type) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO diet_orders (tenant_id, admission_id, patient_id, patient_name, diet_type, diet_type_ar, texture, fluid, allergies, restrictions, supplements, ordered_by, meal_preferences, start_date, end_date, status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'active') RETURNING id
        `, [req.tenantId, admission_id || null, patient_id, patient_name || '', diet_type, diet_type_ar || '', texture || 'regular', fluid || 'regular', allergies || '', restrictions || '', supplements || '', req.userName || req.userId, meal_preferences || '', start_date || null, end_date || null]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/nr/diet-orders', err); res.status(500).json({ error: 'internal_error' }); }
});

// Rehabilitation assessments
router.get('/rehab/:patient_id', requireAuth, requireTenantScope, requireRole('rehab_specialist', 'therapist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, assessment_type, rom_scores, strength_scores, functional_scores, balance_scores,
                   pain_level, plan, therapy_goals, sessions_recommended, risk_level, recommendation, performed_by, created_at
            FROM rehabilitation_assessments WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY created_at DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/nr/rehab', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/rehab', requireAuth, requireTenantScope, requireRole('rehab_specialist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, assessment_type, rom_scores, strength_scores, functional_scores, balance_scores, pain_level, plan, therapy_goals, sessions_recommended, risk_level } = req.body;
        if (!patient_id || !assessment_type) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO rehabilitation_assessments (tenant_id, patient_id, assessment_type, rom_scores, strength_scores, functional_scores, balance_scores, pain_level, plan, therapy_goals, sessions_recommended, risk_level, performed_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id
        `, [req.tenantId, patient_id, assessment_type, JSON.stringify(rom_scores || {}), JSON.stringify(strength_scores || {}), JSON.stringify(functional_scores || {}), JSON.stringify(balance_scores || {}), pain_level || null, plan || '', therapy_goals || '', sessions_recommended || null, risk_level || 'low', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/nr/rehab', err); res.status(500).json({ error: 'internal_error' }); }
});

// Social work assessments
router.get('/social/:patient_id', requireAuth, requireTenantScope, requireRole('social_worker', 'nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, psychosocial_issues, support_system, financial_concerns, referrals, follow_up, created_at
            FROM social_work_assessments WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY created_at DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/nr/social', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/social', requireAuth, requireTenantScope, requireRole('social_worker', 'nurse', 'doctor'), async (req, res) => {
    try {
        const { patient_id, psychosocial_issues, support_system, financial_concerns, referrals, follow_up } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO social_work_assessments (tenant_id, patient_id, psychosocial_issues, support_system, financial_concerns, referrals, follow_up, created_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id
        `, [req.tenantId, patient_id, psychosocial_issues || '', support_system || '', financial_concerns || '', referrals || '', follow_up || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/nr/social', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const n = await db.query(`
            SELECT COUNT(*) as total_assessments,
                   COUNT(*) FILTER (WHERE malnutrition_risk = 'high') as high_malnutrition,
                   COUNT(*) FILTER (WHERE assessment_date >= CURRENT_DATE - INTERVAL '7 days') as assessments_7d
            FROM nutrition_assessments WHERE tenant_id = $1
        `, [req.tenantId]);
        const d = await db.query(`
            SELECT COUNT(*) as active_diet_orders,
                   COUNT(*) FILTER (WHERE diet_type = 'NPO') as npo
            FROM diet_orders WHERE tenant_id = $1 AND status = 'active'
        `, [req.tenantId]);
        const r = await db.query(`SELECT COUNT(*) as total_rehab_assessments FROM rehabilitation_assessments WHERE tenant_id = $1`, [req.tenantId]);
        const s = await db.query(`SELECT COUNT(*) as total_social_assessments, COUNT(*) FILTER (WHERE financial_concerns != '') as financial_concerns FROM social_work_assessments WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, nutrition: n.rows[0], diet_orders: d.rows[0], rehab: r.rows[0], social: s.rows[0] });
    } catch (err) { console.error('GET /api/nr/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['nutrition', 'diet-orders', 'rehab', 'social', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
