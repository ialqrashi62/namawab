const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeNutritionRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.get('/api/nutrition/assessments', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        res.json((await pool.query('SELECT * FROM nutrition_assessments WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/nutrition/assessments', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { patient_id, patient_name, height_cm, weight_kg, caloric_needs, protein_needs, screening_score, malnutrition_risk, plan, assessed_by } = req.body;

        const { tenantId } = getRequestTenantContext(req);

        const bmi = height_cm && weight_kg ? parseFloat((weight_kg / ((height_cm / 100) ** 2)).toFixed(1)) : 0;

        const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';

        const r = await pool.query('INSERT INTO nutrition_assessments (patient_id,patient_name,assessment_date,height_cm,weight_kg,bmi,bmi_category,caloric_needs,protein_needs,screening_score,malnutrition_risk,plan,assessed_by,tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *',

            [patient_id, patient_name, new Date().toISOString().split('T')[0], height_cm || 0, weight_kg || 0, bmi, cat, caloric_needs || 0, protein_needs || 0, screening_score || 0, malnutrition_risk || 'Low', plan, assessed_by, tenantId]);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
