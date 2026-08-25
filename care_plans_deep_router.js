// filepath: namaweb/care_plans_deep_router.js
// Care plans + SMART goals + progress tracking.
'use strict';
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/care-plans', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { status } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 50, 200));
        const r = await db.query(`SELECT id, patient_id, plan_name, plan_template_id, status, start_date, end_date, created_by, created_at FROM care_plans WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC LIMIT $${params.length}`, params);
        res.json({ ok: true, total: r.rows.length, plans: r.rows });
    } catch (err) { console.error('GET /api/cpd/care-plans', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/care-plans', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, plan_name, plan_template_id, status, start_date, end_date } = req.body;
        if (!patient_id || !plan_name) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO care_plans (tenant_id, patient_id, plan_name, plan_template_id, status, start_date, end_date, created_by) VALUES ($1,$2,$3,$4,COALESCE($5,'active'),$6,$7,$8) RETURNING id`, [req.tenantId, patient_id, plan_name, plan_template_id || null, status, start_date || null, end_date || null, req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/cpd/care-plans', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/goal-progress/:care_plan_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, goal_id, goal_text, target_date, current_status, progress_percent, notes, updated_at FROM care_plan_goal_progress WHERE tenant_id = $1 AND care_plan_id = $2 ORDER BY updated_at DESC LIMIT 100`, [req.tenantId, req.params.care_plan_id]);
        res.json({ ok: true, total: r.rows.length, goal_progress: r.rows });
    } catch (err) { console.error('GET /api/cpd/goal-progress', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/goal-progress', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { care_plan_id, goal_id, goal_text, target_date, current_status, progress_percent, notes } = req.body;
        if (!care_plan_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO care_plan_goal_progress (tenant_id, care_plan_id, goal_id, goal_text, target_date, current_status, progress_percent, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`, [req.tenantId, care_plan_id, goal_id || null, goal_text || '', target_date || null, current_status || 'in_progress', progress_percent || 0, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/cpd/goal-progress', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/templates', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, template_name_en, template_name_ar, department_id, version, form_structure, is_active, created_at FROM clinical_smart_templates WHERE tenant_id = $1 AND is_active = true ORDER BY template_name_en LIMIT 100`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, templates: r.rows });
    } catch (err) { console.error('GET /api/cpd/templates', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'nurse'), async (req, res) => {
    try {
        const p = await db.query(`SELECT COUNT(*) as total_plans, COUNT(*) FILTER (WHERE status = 'active') as active_plans, COUNT(*) FILTER (WHERE status = 'completed') as completed_plans FROM care_plans WHERE tenant_id = $1`, [req.tenantId]);
        const g = await db.query(`SELECT current_status, COUNT(*) as goals, ROUND(AVG(progress_percent)::numeric, 1) as avg_progress FROM care_plan_goal_progress WHERE tenant_id = $1 GROUP BY current_status ORDER BY current_status`, [req.tenantId]);
        res.json({ ok: true, care_plans: p.rows[0], goal_progress: g.rows });
    } catch (err) { console.error('GET /api/cpd/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['care-plans', 'goal-progress', 'templates', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
