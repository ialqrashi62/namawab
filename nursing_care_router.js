// filepath: namaweb/nursing_care_router.js
// Nursing care plans (NANDA-aligned goals + interventions).
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const { status, priority, patient_id } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (priority) { params.push(priority); conditions.push(`priority = $${params.length}`); }
        if (patient_id) { params.push(patient_id); conditions.push(`patient_id = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, patient_name, admission_id, diagnosis, priority,
                   goals, interventions, expected_outcomes, nurse, status, review_date, created_at
            FROM nursing_care_plans
            WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, plans: r.rows });
    } catch (err) { console.error('GET /api/nursing-care', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/active', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, patient_name, diagnosis, priority, nurse, review_date, created_at
            FROM nursing_care_plans
            WHERE tenant_id = $1 AND status = 'active'
            ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END,
                     created_at LIMIT 200
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, plans: r.rows });
    } catch (err) { console.error('GET /api/nursing-care/active', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/due-review', requireAuth, requireTenantScope, requireRole('nurse', 'admin'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 7, 90);
        const r = await db.query(`
            SELECT id, patient_id, patient_name, diagnosis, priority, nurse, review_date,
                   (review_date - CURRENT_DATE) as days_until_review
            FROM nursing_care_plans
            WHERE tenant_id = $1 AND status = 'active' AND review_date IS NOT NULL
              AND review_date <= CURRENT_DATE + $2::int
            ORDER BY review_date ASC LIMIT 100
        `, [req.tenantId, days]);
        res.json({ ok: true, period_days: days, total: r.rows.length, plans: r.rows });
    } catch (err) { console.error('GET /api/nursing-care/due-review', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/', requireAuth, requireTenantScope, requireRole('nurse', 'admin'), async (req, res) => {
    try {
        const { patient_id, patient_name, admission_id, diagnosis, priority, goals, interventions, expected_outcomes, review_date } = req.body;
        if (!patient_id || !diagnosis || !goals) return res.status(400).json({ error: 'missing_required', required: ['patient_id', 'diagnosis', 'goals'] });
        const r = await db.query(`
            INSERT INTO nursing_care_plans (tenant_id, patient_id, patient_name, admission_id, diagnosis, priority, goals, interventions, expected_outcomes, nurse, status, review_date)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'active',$11) RETURNING id
        `, [req.tenantId, patient_id, patient_name || '', admission_id || null, diagnosis, priority || 'medium', goals, interventions || '', expected_outcomes || '', req.userName || '', review_date || null]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/nursing-care', err); res.status(500).json({ error: 'internal_error' }); }
});

router.put('/:id', requireAuth, requireTenantScope, requireRole('nurse', 'admin'), async (req, res) => {
    try {
        const { goals, interventions, expected_outcomes, review_date, priority, status } = req.body;
        const updates = [];
        const params = [];
        let pi = 1;
        if (goals !== undefined) { updates.push(`goals = $${pi++}`); params.push(goals); }
        if (interventions !== undefined) { updates.push(`interventions = $${pi++}`); params.push(interventions); }
        if (expected_outcomes !== undefined) { updates.push(`expected_outcomes = $${pi++}`); params.push(expected_outcomes); }
        if (review_date !== undefined) { updates.push(`review_date = $${pi++}`); params.push(review_date); }
        if (priority) { updates.push(`priority = $${pi++}`); params.push(priority); }
        if (status) { updates.push(`status = $${pi++}`); params.push(status); }
        if (updates.length === 0) return res.status(400).json({ error: 'nothing_to_update' });
        params.push(req.params.id, req.tenantId);
        const r = await db.query(`UPDATE nursing_care_plans SET ${updates.join(', ')} WHERE id = $${pi++} AND tenant_id = $${pi++} RETURNING id, status, review_date`, params);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('PUT /api/nursing-care/:id', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/:id/discontinue', requireAuth, requireTenantScope, requireRole('nurse', 'admin'), async (req, res) => {
    try {
        const { reason } = req.body;
        const r = await db.query(`
            UPDATE nursing_care_plans SET status = 'discontinued', interventions = COALESCE(interventions || E'\n[DISCONTINUED] ', '') || $3
            WHERE id = $1 AND tenant_id = $2 AND status = 'active' RETURNING id, status
        `, [req.params.id, req.tenantId, reason || 'No reason given']);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_not_active' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/nursing-care/:id/discontinue', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT COUNT(*) as total,
                   COUNT(*) FILTER (WHERE status = 'active') as active,
                   COUNT(*) FILTER (WHERE status = 'discontinued') as discontinued,
                   COUNT(*) FILTER (WHERE priority = 'high') as high_priority,
                   COUNT(*) FILTER (WHERE review_date IS NOT NULL AND review_date <= CURRENT_DATE + INTERVAL '7 days' AND status = 'active') as due_for_review_7d
            FROM nursing_care_plans WHERE tenant_id = $1
        `, [req.tenantId]);
        const byNurse = await db.query(`
            SELECT COALESCE(nurse, 'unassigned') as nurse, COUNT(*) as cnt
            FROM nursing_care_plans WHERE tenant_id = $1 AND status = 'active'
            GROUP BY nurse ORDER BY cnt DESC LIMIT 10
        `, [req.tenantId]);
        res.json({ ok: true, summary: r.rows[0], by_nurse: byNurse.rows });
    } catch (err) { console.error('GET /api/nursing-care/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['list', 'active', 'due-review', 'create', 'update', 'discontinue', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
