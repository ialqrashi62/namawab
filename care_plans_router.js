// filepath: namaweb/care_plans_router.js
'use strict';
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// SMART goal templates per problem
const PROBLEM_TEMPLATES = {
    'fall_risk': {
        title: 'Fall Risk Reduction',
        problem: 'Patient at elevated risk for falls',
        goals: [
            'Patient will remain free from falls during hospitalization',
            'Patient will demonstrate proper use of call light before transfers',
            'Patient will verbalize understanding of fall prevention strategies by discharge'
        ],
        interventions: [
            'Implement fall precautions: bed in low position, non-slip footwear',
            'Hourly rounding; assess pain, positioning, toileting needs',
            'PT consult for gait/balance assessment',
            'Education on fall prevention; involve family/caregiver'
        ],
        disciplines: ['nursing', 'physiotherapy', 'patient_education']
    },
    'pain_management': {
        title: 'Pain Management Plan',
        problem: 'Acute or chronic pain requiring multimodal management',
        goals: [
            'Patient will report pain ≤3/10 within 24 hours',
            'Patient will demonstrate understanding of pain scale',
            'Patient will use non-pharmacological techniques as appropriate'
        ],
        interventions: [
            'Multimodal analgesia: scheduled acetaminophen + PRN opioid if needed',
            'Reassess pain every 4 hours using NRS or FLACC scale',
            'Non-pharmacological: positioning, ice/heat, distraction, relaxation techniques',
            'Monitor for opioid side effects: sedation, respiratory depression, constipation'
        ],
        disciplines: ['nursing', 'physician', 'pharmacy', 'patient_education']
    },
    'wound_care': {
        title: 'Wound Care Plan',
        problem: 'Active wound requiring structured healing plan',
        goals: [
            'Wound will show progressive granulation tissue and reduction in size',
            'No signs of infection (no erythema, drainage, or fever)',
            'Patient/caregiver will demonstrate wound care technique'
        ],
        interventions: [
            'Dressing changes per protocol (typically daily or QOD)',
            'Monitor for signs of infection; document wound measurements weekly',
            'Nutritional support: protein 1.5-2 g/kg/day, vitamin C, zinc',
            'Offloading/pressure redistribution as indicated'
        ],
        disciplines: ['nursing', 'wound_care_nurse', 'nutrition', 'physician']
    },
    'diabetes_management': {
        title: 'Diabetes Management Plan',
        problem: 'Diabetes mellitus requiring glycemic control',
        goals: [
            'Maintain blood glucose 80-180 mg/dL during hospitalization',
            'HbA1c improvement or stabilization at follow-up',
            'Patient will verbalize understanding of diabetes self-management'
        ],
        interventions: [
            'Blood glucose monitoring AC and HS (or sliding scale)',
            'Insulin regimen per sliding scale or basal-bolus protocol',
            'Diabetic diet; carb-controlled meals',
            'Diabetes education: signs/symptoms of hypo/hyperglycemia, glucose monitoring technique'
        ],
        disciplines: ['nursing', 'endocrinology', 'nutrition', 'diabetes_educator', 'patient_education']
    },
    'mobility': {
        title: 'Mobility & Activity Plan',
        problem: 'Impaired mobility requiring structured rehabilitation',
        goals: [
            'Patient will ambulate 50 feet independently with assistive device',
            'Patient will perform ADLs with minimal assistance',
            'Patient will demonstrate safe transfer technique'
        ],
        interventions: [
            'PT/OT consult for mobility assessment and exercise program',
            'Out of bed to chair for meals; progressive ambulation TID',
            'Fall precautions during all mobility activities',
            'Family training on safe transfer techniques'
        ],
        disciplines: ['nursing', 'physiotherapy', 'occupational_therapy', 'patient_education']
    }
};

function listTemplates() {
    return Object.entries(PROBLEM_TEMPLATES).map(([k, v]) => ({
        code: k, title: v.title, problem: v.problem,
        goal_count: v.goals.length, intervention_count: v.interventions.length,
        disciplines: v.disciplines
    }));
}

// GET /api/care-plans/templates
router.get('/templates', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), (req, res) => {
    res.json({ ok: true, templates: listTemplates() });
});

// GET /api/care-plans?patient_id=X
router.get('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const patientId = req.query.patient_id;
        if (!patientId) return res.status(400).json({ error: 'missing_patient_id' });
        const result = await db.query(`
            SELECT id, title, problem, status, disciplines, review_date, signed_at, created_at, authored_by
            FROM care_plans WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY created_at DESC LIMIT 20
        `, [req.tenantId, patientId]);
        res.json({ ok: true, total: result.rows.length, plans: result.rows });
    } catch (err) {
        console.error('GET /api/care-plans', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/care-plans/:id
router.get('/:id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const planRes = await db.query(`SELECT * FROM care_plans WHERE id = $1 AND tenant_id = $2`, [req.params.id, req.tenantId]);
        if (planRes.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        const progressRes = await db.query(`SELECT goal_idx, progress_pct, notes, updated_at FROM care_plan_goal_progress WHERE care_plan_id = $1 ORDER BY goal_idx`, [req.params.id]);
        res.json({ ok: true, plan: planRes.rows[0], goal_progress: progressRes.rows });
    } catch (err) {
        console.error('GET /api/care-plans/:id', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// POST /api/care-plans
router.post('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, title, problem, goals, interventions, disciplines, review_date } = req.body;
        if (!patient_id || !title) return res.status(400).json({ error: 'missing_required', required: ['patient_id', 'title'] });
        const result = await db.query(`
            INSERT INTO care_plans (tenant_id, patient_id, authored_by, title, problem, goals, interventions, disciplines, review_date)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id
        `, [req.tenantId, patient_id, req.userId, title, problem || '', JSON.stringify(goals || []), JSON.stringify(interventions || []), JSON.stringify(disciplines || []), review_date || null]);
        res.status(201).json({ ok: true, id: result.rows[0].id });
    } catch (err) {
        console.error('POST /api/care-plans', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// POST /api/care-plans/from-template
router.post('/from-template', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, template_code, review_date } = req.body;
        if (!patient_id || !template_code) return res.status(400).json({ error: 'missing_required', required: ['patient_id', 'template_code'] });
        const tpl = PROBLEM_TEMPLATES[template_code];
        if (!tpl) return res.status(400).json({ error: 'invalid_template', valid: Object.keys(PROBLEM_TEMPLATES) });
        const result = await db.query(`
            INSERT INTO care_plans (tenant_id, patient_id, authored_by, title, problem, goals, interventions, disciplines, review_date)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id
        `, [req.tenantId, patient_id, req.userId, tpl.title, tpl.problem, JSON.stringify(tpl.goals), JSON.stringify(tpl.interventions), JSON.stringify(tpl.disciplines), review_date || null]);
        res.status(201).json({ ok: true, id: result.rows[0].id, template_used: template_code });
    } catch (err) {
        console.error('POST /api/care-plans/from-template', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// POST /api/care-plans/:id/goals/:goalIdx/progress
router.post('/:id/goals/:goalIdx/progress', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { progress_pct, notes } = req.body;
        const goalIdx = +req.params.goalIdx;
        if (progress_pct == null || progress_pct < 0 || progress_pct > 100) return res.status(400).json({ error: 'invalid_progress_pct', range: '0-100' });
        await db.query(`
            INSERT INTO care_plan_goal_progress (tenant_id, care_plan_id, goal_idx, progress_pct, notes, updated_by)
            VALUES ($1,$2,$3,$4,$5,$6)
            ON CONFLICT (care_plan_id, goal_idx) DO UPDATE SET progress_pct = EXCLUDED.progress_pct, notes = EXCLUDED.notes, updated_by = EXCLUDED.updated_by, updated_at = NOW()
        `, [req.tenantId, req.params.id, goalIdx, progress_pct, notes || '', req.userId]);
        res.json({ ok: true });
    } catch (err) {
        console.error('POST /api/care-plans/goal/progress', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// POST /api/care-plans/:id/sign
router.post('/:id/sign', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const result = await db.query(`
            UPDATE care_plans SET signed_at = NOW(), locked_at = NOW(), updated_at = NOW()
            WHERE id = $1 AND tenant_id = $2 AND signed_at IS NULL RETURNING id, signed_at
        `, [req.params.id, req.tenantId]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'not_found_or_already_signed' });
        res.json({ ok: true, ...result.rows[0] });
    } catch (err) {
        console.error('POST /api/care-plans/sign', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', templates: Object.keys(PROBLEM_TEMPLATES), timestamp: new Date().toISOString() });
});

module.exports = router;