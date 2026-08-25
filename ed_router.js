// filepath: namaweb/ed_router.js
// Emergency department + triage.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/visits', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { status, acuity, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (acuity) { params.push(acuity); conditions.push(`acuity = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`arrival_time >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, patient_name, age, gender, chief_complaint, arrival_mode,
                   acuity, status, triage_assigned_to, physician_id, arrival_time, disposition, created_at
            FROM emergency_visits WHERE ${conditions.join(' AND ')}
            ORDER BY arrival_time DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, visits: r.rows });
    } catch (err) { console.error('GET /api/ed/visits', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/visits/active', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, patient_name, age, gender, chief_complaint, acuity, status,
                   arrival_time, EXTRACT(EPOCH FROM (NOW() - arrival_time))/60 as minutes_waiting
            FROM emergency_visits WHERE tenant_id = $1 AND status NOT IN ('discharged', 'admitted', 'transferred', 'left_without_being_seen')
            ORDER BY CASE acuity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END,
                     arrival_time LIMIT 200
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, visits: r.rows });
    } catch (err) { console.error('GET /api/ed/visits/active', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/visits', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const { patient_id, patient_name, age, gender, chief_complaint, arrival_mode, acuity } = req.body;
        if (!patient_name || !chief_complaint) return res.status(400).json({ error: 'missing_required', required: ['patient_name', 'chief_complaint'] });
        const r = await db.query(`
            INSERT INTO emergency_visits (tenant_id, patient_id, patient_name, age, gender, chief_complaint, arrival_mode, acuity, status, triage_assigned_to, arrival_time)
            VALUES ($1,$2,$3,$4,$5,$6,$7,COALESCE($8,'medium'),'waiting',$9,NOW()) RETURNING id
        `, [req.tenantId, patient_id || null, patient_name, age || null, gender || '', chief_complaint, arrival_mode || 'walk-in', acuity || 'medium', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/ed/visits', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/visits/:id/disposition', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const { disposition, physician_id, discharge_notes } = req.body;
        if (!disposition) return res.status(400).json({ error: 'missing_required', required: ['disposition'] });
        const r = await db.query(`
            UPDATE emergency_visits SET status = $3, disposition = $3, physician_id = COALESCE($4, physician_id), discharge_time = NOW()
            WHERE id = $1 AND tenant_id = $2 RETURNING id, status, disposition, discharge_time
        `, [req.params.id, req.tenantId, disposition, physician_id || null]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/ed/visits/:id/disposition', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/triage', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, patient_name, age, gender, chief_complaint, acuity,
                   arrival_time, EXTRACT(EPOCH FROM (NOW() - arrival_time))/60 as minutes_waiting,
                   status, triage_assigned_to
            FROM emergency_visits WHERE tenant_id = $1 AND status = 'waiting'
            ORDER BY CASE acuity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 WHEN 'low' THEN 4 ELSE 5 END,
                     arrival_time LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, waiting: r.rows });
    } catch (err) { console.error('GET /api/ed/triage', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'nurse'), async (req, res) => {
    try {
        const v = await db.query(`
            SELECT COUNT(*) as total,
                   COUNT(*) FILTER (WHERE status = 'waiting') as waiting,
                   COUNT(*) FILTER (WHERE status = 'in_treatment') as in_treatment,
                   COUNT(*) FILTER (WHERE status = 'discharged') as discharged,
                   COUNT(*) FILTER (WHERE status = 'admitted') as admitted,
                   COUNT(*) FILTER (WHERE acuity = 'critical') as critical,
                   COUNT(*) FILTER (WHERE arrival_time::date = CURRENT_DATE) as today,
                   AVG(EXTRACT(EPOCH FROM (discharge_time - arrival_time))/60) FILTER (WHERE discharge_time IS NOT NULL)::numeric(10,2) as avg_los_minutes
            FROM emergency_visits WHERE tenant_id = $1
        `, [req.tenantId]);
        const byAc = await db.query(`
            SELECT acuity, COUNT(*) as cnt FROM emergency_visits
            WHERE tenant_id = $1 GROUP BY acuity ORDER BY cnt DESC
        `, [req.tenantId]);
        res.json({ ok: true, summary: v.rows[0], by_acuity: byAc.rows });
    } catch (err) { console.error('GET /api/ed/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['visits', 'triage', 'disposition', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
