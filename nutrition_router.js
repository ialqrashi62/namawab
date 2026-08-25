'use strict';
// Wave 76 — Clinical Nutrition: assessments + diet orders
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_BMI_CATEGORIES = ['underweight','normal','overweight','obese_class_1','obese_class_2','obese_class_3'];
const VALID_RISK = ['low','moderate','high','severe'];
const VALID_DIET_TYPES = ['regular','soft','liquid','cardiac','diabetic','renal','low_sodium','high_protein','low_fat','gluten_free','vegan','kosher','halal','npo'];

function bmiCategory(bmi) {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    if (bmi < 35) return 'obese_class_1';
    if (bmi < 40) return 'obese_class_2';
    return 'obese_class_3';
}

function malnutritionRiskFromScore(score) {
    if (score === null || score === undefined) return null;
    if (score >= 2) return 'severe';
    if (score >= 1) return 'moderate';
    return 'low';
}

function idealBodyWeight(heightCm, sex = 'unknown') {
    if (!heightCm || heightCm < 100) return null;
    const inchesOver5ft = (heightCm - 152.4) / 2.54;
    const base = sex === 'female' ? 45.5 : 50;
    return Math.round((base + 2.3 * inchesOver5ft) * 10) / 10;
}

function harrisBenedict(weightKg, heightCm, age = 30, sex = 'male', activity = 1.3) {
    if (!weightKg || !heightCm) return null;
    let bmr;
    if (sex === 'female') bmr = 655.1 + 9.563 * weightKg + 1.850 * heightCm - 4.676 * age;
    else bmr = 66.5 + 13.75 * weightKg + 5.003 * heightCm - 6.755 * age;
    return Math.round(bmr * activity);
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'nutrition',
        endpoints: [
            'GET /assessments',
            'GET /assessments/:id',
            'POST /assessments',
            'GET /assessments/patient/:patientId',
            'GET /diet-orders',
            'POST /diet-orders',
            'PUT /diet-orders/:id',
            'DELETE /diet-orders/:id',
            'GET /patient-summary/:patientId',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== ASSESSMENTS =====
router.get('/assessments', requireAuth, requireTenantScope, requireRole('dietitian'), async (req, res) => {
    try {
        const { patient_id, risk, limit = 50 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT a.*, u.full_name AS assessed_by_name FROM nutrition_assessments a LEFT JOIN users u ON u.id = a.assessed_by WHERE a.tenant_id = $1`;
        if (patient_id) { sql += ` AND a.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (risk) { sql += ` AND a.malnutrition_risk = $${params.length + 1}`; params.push(risk); }
        sql += ` ORDER BY a.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/assessments/:id', requireAuth, requireTenantScope, requireRole('dietitian'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT a.*, u.full_name AS assessed_by_name FROM nutrition_assessments a LEFT JOIN users u ON u.id = a.assessed_by
             WHERE a.tenant_id = $1 AND a.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'assessment_not_found' });
        res.json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/assessments', requireAuth, requireTenantScope, requireRole('dietitian'), async (req, res) => {
    try {
        const {
            patient_id, patient_name, assessment_date = new Date(),
            height_cm, weight_kg, age = 30, sex = 'male', activity = 1.3,
            screening_score, plan, assessed_by
        } = req.body;

        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });

        let bmi = req.body.bmi;
        if (!bmi && weight_kg && height_cm) {
            const hm = parseFloat(height_cm) / 100;
            if (hm > 0) bmi = Math.round((parseFloat(weight_kg) / (hm * hm)) * 10) / 10;
        }
        const category = req.body.bmi_category || (bmi ? bmiCategory(bmi) : null);
        const ibw = req.body.ideal_body_weight || idealBodyWeight(height_cm, sex);
        const caloric = req.body.caloric_needs || harrisBenedict(weight_kg, height_cm, age, sex, activity);
        const protein = req.body.protein_needs || (weight_kg ? Math.round(weight_kg * 1.2) : null);
        const risk = req.body.malnutrition_risk || malnutritionRiskFromScore(screening_score);

        if (category && !VALID_BMI_CATEGORIES.includes(category)) return res.status(400).json({ ok: false, error: 'invalid_bmi_category' });
        if (risk && !VALID_RISK.includes(risk)) return res.status(400).json({ ok: false, error: 'invalid_risk' });

        const r = await db.query(
            `INSERT INTO nutrition_assessments (patient_id, patient_name, assessment_date, height_cm, weight_kg, bmi, bmi_category, ideal_body_weight, caloric_needs, protein_needs, screening_score, malnutrition_risk, plan, assessed_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
            [patient_id, patient_name || null, assessment_date, height_cm || null, weight_kg || null, bmi, category, ibw, caloric, protein, screening_score !== undefined ? screening_score : null, risk, plan || null, assessed_by || req.user?.id || null, req.tenantId]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0], computed: { bmi, category, ibw, caloric, protein, risk } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/assessments/patient/:patientId', requireAuth, requireTenantScope, requireRole('dietitian'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT a.*, u.full_name AS assessed_by_name FROM nutrition_assessments a LEFT JOIN users u ON u.id = a.assessed_by
             WHERE a.tenant_id = $1 AND a.patient_id = $2 ORDER BY a.created_at DESC LIMIT 30`,
            [req.tenantId, req.params.patientId]
        );
        res.json({ ok: true, count: r.rows.length, latest: r.rows[0] || null, history: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== DIET ORDERS =====
router.get('/diet-orders', requireAuth, requireTenantScope, requireRole('dietitian'), async (req, res) => {
    try {
        const { patient_id, status, diet_type, admission_id, limit = 50 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT d.*, u.full_name AS ordered_by_name FROM diet_orders d LEFT JOIN users u ON u.id = d.ordered_by WHERE d.tenant_id = $1`;
        if (patient_id) { sql += ` AND d.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (admission_id) { sql += ` AND d.admission_id = $${params.length + 1}`; params.push(admission_id); }
        if (status) { sql += ` AND d.status = $${params.length + 1}`; params.push(status); }
        if (diet_type) { sql += ` AND d.diet_type = $${params.length + 1}`; params.push(diet_type); }
        sql += ` ORDER BY d.start_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/diet-orders', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const {
            admission_id, patient_id, patient_name, diet_type, diet_type_ar,
            texture, fluid, allergies, restrictions, supplements, ordered_by,
            meal_preferences, start_date = new Date(), end_date, notes
        } = req.body;

        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!diet_type) return res.status(400).json({ ok: false, error: 'diet_type_required' });
        if (!VALID_DIET_TYPES.includes(diet_type)) return res.status(400).json({ ok: false, error: 'invalid_diet_type', valid: VALID_DIET_TYPES });

        const r = await db.query(
            `INSERT INTO diet_orders (admission_id, patient_id, patient_name, diet_type, diet_type_ar, texture, fluid, allergies, restrictions, supplements, ordered_by, meal_preferences, start_date, end_date, status, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'active',$15,$16) RETURNING *`,
            [admission_id || null, patient_id, patient_name || null, diet_type, diet_type_ar || null,
             texture || null, fluid || null, allergies || null,
             restrictions ? JSON.stringify(restrictions) : null,
             supplements ? JSON.stringify(supplements) : null,
             ordered_by || req.user?.id || null,
             meal_preferences || null,
             start_date, end_date || null,
             notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, order: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.put('/diet-orders/:id', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const allowed = ['diet_type','diet_type_ar','texture','fluid','allergies','meal_preferences','end_date','status','notes'];
        const sets = [];
        const params = [req.tenantId, req.params.id];
        let i = 3;
        for (const k of allowed) {
            if (k in req.body) { sets.push(`${k} = $${i++}`); params.push(req.body[k]); }
        }
        if ('restrictions' in req.body) { sets.push(`restrictions = $${i++}`); params.push(req.body.restrictions ? JSON.stringify(req.body.restrictions) : null); }
        if ('supplements' in req.body) { sets.push(`supplements = $${i++}`); params.push(req.body.supplements ? JSON.stringify(req.body.supplements) : null); }
        if (!sets.length) return res.status(400).json({ ok: false, error: 'no_fields' });
        const r = await db.query(`UPDATE diet_orders SET ${sets.join(', ')} WHERE tenant_id = $1 AND id = $2 RETURNING *`, params);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'order_not_found' });
        res.json({ ok: true, order: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.delete('/diet-orders/:id', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `UPDATE diet_orders SET status = 'cancelled', end_date = NOW() WHERE tenant_id = $1 AND id = $2 RETURNING *`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'order_not_found' });
        res.json({ ok: true, cancelled: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== COMBINED VIEW =====
router.get('/patient-summary/:patientId', requireAuth, requireTenantScope, requireRole('dietitian'), async (req, res) => {
    try {
        const ass = await db.query(
            `SELECT * FROM nutrition_assessments WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 1`,
            [req.tenantId, req.params.patientId]
        );
        const orders = await db.query(
            `SELECT * FROM diet_orders WHERE tenant_id = $1 AND patient_id = $2 AND status = 'active' ORDER BY start_date DESC`,
            [req.tenantId, req.params.patientId]
        );
        res.json({
            ok: true,
            latest_assessment: ass.rows[0] || null,
            active_orders: orders.rows,
            active_count: orders.rows.length
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const a = await db.query(
            `SELECT malnutrition_risk, COUNT(*) AS count FROM nutrition_assessments WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY malnutrition_risk`,
            [req.tenantId]
        );
        const d = await db.query(
            `SELECT diet_type, COUNT(*) AS count FROM diet_orders WHERE tenant_id = $1 AND start_date >= NOW() - INTERVAL '90 days' GROUP BY diet_type ORDER BY count DESC LIMIT 10`,
            [req.tenantId]
        );
        const b = await db.query(
            `SELECT bmi_category, COUNT(*) AS count FROM nutrition_assessments WHERE tenant_id = $1 AND bmi_category IS NOT NULL AND created_at >= NOW() - INTERVAL '90 days' GROUP BY bmi_category`,
            [req.tenantId]
        );
        res.json({ ok: true, risk_distribution: a.rows, top_diets: d.rows, bmi_distribution: b.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
