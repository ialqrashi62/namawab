// filepath: namaweb/kpi_router.js
// Quality KPIs + waiting queue (clinic flow).
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Quality KPIs
router.get('/kpis', requireAuth, requireTenantScope, requireRole('admin', 'quality', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { category, period, status, department } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (category) { params.push(category); conditions.push(`category = $${params.length}`); }
        if (period) { params.push(period); conditions.push(`period = $${params.length}`); }
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (department) { params.push(department); conditions.push(`department = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, kpi_name, kpi_name_ar, category, target_value, actual_value, unit,
                   period, department, status, notes, created_at
            FROM quality_kpis WHERE ${conditions.join(' AND ')}
            ORDER BY period DESC, category LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, kpis: r.rows });
    } catch (err) { console.error('GET /api/kpi/kpis', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/kpis', requireAuth, requireTenantScope, requireRole('admin', 'quality', 'doctor'), async (req, res) => {
    try {
        const { kpi_name, kpi_name_ar, category, target_value, actual_value, unit, period, department, notes } = req.body;
        if (!kpi_name) return res.status(400).json({ error: 'missing_required' });
        // Status: met/missed/in_progress based on actual vs target
        let status = 'in_progress';
        if (actual_value != null && target_value != null) {
            status = actual_value >= target_value ? 'met' : 'missed';
        }
        const r = await db.query(`
            INSERT INTO quality_kpis (tenant_id, kpi_name, kpi_name_ar, category, target_value, actual_value, unit, period, department, status, notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id
        `, [req.tenantId, kpi_name, kpi_name_ar || '', category || 'general', target_value, actual_value, unit || '', period || '', department || '', status, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id, status });
    } catch (err) { console.error('POST /api/kpi/kpis', err); res.status(500).json({ error: 'internal_error' }); }
});

// Waiting queue (clinic flow tracking)
router.get('/waiting-queue', requireAuth, requireTenantScope, requireRole('nurse', 'receptionist', 'doctor', 'admin'), async (req, res) => {
    try {
        const { department, status } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (department) { params.push(department); conditions.push(`department = $${params.length}`); }
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, patient_name, doctor, department, status, triage_level, acuity_notes,
                   exam_room_id, check_in_time, updated_at,
                   EXTRACT(EPOCH FROM (NOW() - check_in_time))/60 as minutes_waiting
            FROM waiting_queue WHERE ${conditions.join(' AND ')}
            ORDER BY CASE triage_level WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 WHEN 'low' THEN 4 ELSE 5 END,
                     check_in_time LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, queue: r.rows });
    } catch (err) { console.error('GET /api/kpi/waiting-queue', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/waiting-queue', requireAuth, requireTenantScope, requireRole('receptionist', 'nurse', 'admin'), async (req, res) => {
    try {
        const { patient_id, patient_name, doctor, department, triage_level, acuity_notes, exam_room_id } = req.body;
        if (!patient_id || !patient_name) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO waiting_queue (tenant_id, patient_id, patient_name, doctor, department, status, triage_level, acuity_notes, exam_room_id, check_in_time, updated_at)
            VALUES ($1, $2, $3, $4, $5, 'waiting', $6, $7, $8, NOW(), NOW()) RETURNING id
        `, [req.tenantId, patient_id, patient_name, doctor || '', department || '', triage_level || 'medium', acuity_notes || '', exam_room_id || null]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/kpi/waiting-queue', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/waiting-queue/:id/transition', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'receptionist', 'admin'), async (req, res) => {
    try {
        const { status, exam_room_id } = req.body;
        const valid = ['waiting', 'in_consultation', 'completed', 'no_show', 'cancelled'];
        if (!valid.includes(status)) return res.status(400).json({ error: 'invalid_status', allowed: valid });
        const r = await db.query(`
            UPDATE waiting_queue SET status = $3, exam_room_id = COALESCE($4, exam_room_id), updated_at = NOW()
            WHERE id = $1 AND tenant_id = $2 RETURNING id, status, updated_at
        `, [req.params.id, req.tenantId, status, exam_room_id]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/kpi/waiting-queue/transition', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'quality', 'doctor'), async (req, res) => {
    try {
        const k = await db.query(`
            SELECT category,
                   COUNT(*) FILTER (WHERE status = 'met') as met_count,
                   COUNT(*) FILTER (WHERE status = 'missed') as missed_count,
                   ROUND(AVG(CASE WHEN target_value > 0 THEN (actual_value / target_value * 100) ELSE NULL END)::numeric, 1) as avg_pct_of_target
            FROM quality_kpis WHERE tenant_id = $1 GROUP BY category ORDER BY category
        `, [req.tenantId]);
        const q = await db.query(`
            SELECT COUNT(*) FILTER (WHERE status = 'waiting') as waiting,
                   COUNT(*) FILTER (WHERE status = 'in_consultation') as in_consultation,
                   COUNT(*) FILTER (WHERE status = 'completed' AND updated_at >= CURRENT_DATE) as completed_today,
                   ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - check_in_time))/60)::numeric, 1) FILTER (WHERE status IN ('completed', 'in_consultation')) as avg_min_per_visit
            FROM waiting_queue WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, kpis_by_category: k.rows, queue_summary: q.rows[0] });
    } catch (err) { console.error('GET /api/kpi/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['kpis', 'waiting-queue', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
