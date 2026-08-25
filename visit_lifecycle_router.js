'use strict';
// Wave 95 — Visit Lifecycle: patient flow tracking (arrival → triage → consult)
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_STATUS = ['arrived','triaged','in_consult','completed','left_without_being_seen','cancelled'];
const VALID_STAGE = ['reception','triage','waiting_consult','in_consult','disposition','completed'];
const VALID_TRIAGE = ['1_resuscitation','2_emergent','3_urgent','4_less_urgent','5_non_urgent'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'visit-lifecycle',
        endpoints: [
            'GET /visits',
            'GET /visits/:id',
            'POST /visits',
            'POST /visits/:id/triage',
            'POST /visits/:id/start-consult',
            'POST /visits/:id/complete',
            'GET /visits/patient/:patientId',
            'GET /waiting',
            'GET /in-consult',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

router.get('/visits', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, department, status, stage, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT v.*, p.full_name AS patient_full_name, p.mrn FROM visit_lifecycle v LEFT JOIN patients p ON p.id = v.patient_id WHERE v.tenant_id = $1`;
        if (patient_id) { sql += ` AND v.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (department) { sql += ` AND v.department = $${params.length + 1}`; params.push(department); }
        if (status) { sql += ` AND v.status = $${params.length + 1}`; params.push(status); }
        if (stage) { sql += ` AND v.stage = $${params.length + 1}`; params.push(stage); }
        sql += ` ORDER BY v.arrived_at DESC NULLS LAST, v.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(x => {
            const wait_min = x.triage_at && x.arrived_at ? Math.round((new Date(x.triage_at) - new Date(x.arrived_at)) / 60000) : null;
            const consult_min = x.consult_start && x.triage_at ? Math.round((new Date(x.consult_start) - new Date(x.triage_at)) / 60000) : null;
            return { ...x, wait_to_triage_minutes: wait_min, triage_to_consult_minutes: consult_min };
        });
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/visits/:id', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT v.*, p.full_name AS patient_full_name, p.mrn FROM visit_lifecycle v LEFT JOIN patients p ON p.id = v.patient_id
             WHERE v.tenant_id = $1 AND v.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'visit_not_found' });
        const row = r.rows[0];
        const flow = [
            { step: 'arrival', timestamp: row.arrived_at, completed: !!row.arrived_at },
            { step: 'triage', timestamp: row.triage_at, completed: !!row.triage_at, level: row.triage_level },
            { step: 'consult', timestamp: row.consult_start, completed: !!row.consult_start }
        ];
        res.json({ ok: true, visit: row, flow });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/visits', requireAuth, requireTenantScope, requireRole('receptionist'), async (req, res) => {
    try {
        const { patient_id, patient_name, appointment_id, doctor, department } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!department) return res.status(400).json({ ok: false, error: 'department_required' });

        const r = await db.query(
            `INSERT INTO visit_lifecycle (tenant_id, patient_id, patient_name, appointment_id, doctor, department, status, stage, arrived_at)
             VALUES ($1,$2,$3,$4,$5,$6,'arrived','reception',NOW()) RETURNING *`,
            [req.tenantId, patient_id, patient_name || null, appointment_id || null, doctor || null, department]
        );
        res.status(201).json({ ok: true, visit: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/visits/:id/triage', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { triage_level, pain_score } = req.body;
        if (!triage_level) return res.status(400).json({ ok: false, error: 'triage_level_required' });
        if (!VALID_TRIAGE.includes(triage_level)) return res.status(400).json({ ok: false, error: 'invalid_triage_level', valid: VALID_TRIAGE });
        if (pain_score !== undefined && (pain_score < 0 || pain_score > 10)) return res.status(400).json({ ok: false, error: 'pain_score_out_of_range' });

        const r = await db.query(
            `UPDATE visit_lifecycle SET status = 'triaged', stage = 'waiting_consult', triage_at = NOW(), triage_level = $3, pain_score = $4
             WHERE tenant_id = $1 AND id = $2 AND status = 'arrived' RETURNING *`,
            [req.tenantId, req.params.id, triage_level, pain_score !== undefined ? pain_score : null]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_triage' });
        res.json({ ok: true, visit: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/visits/:id/start-consult', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `UPDATE visit_lifecycle SET status = 'in_consult', stage = 'in_consult', consult_start = NOW()
             WHERE tenant_id = $1 AND id = $2 AND status = 'triaged' RETURNING *`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_start_consult' });
        res.json({ ok: true, visit: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/visits/:id/complete', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { outcome = 'completed' } = req.body;
        if (!['completed', 'left_without_being_seen'].includes(outcome)) return res.status(400).json({ ok: false, error: 'invalid_outcome' });

        const r = await db.query(
            `UPDATE visit_lifecycle SET status = $3, stage = 'completed'
             WHERE tenant_id = $1 AND id = $2 AND status IN ('triaged','in_consult') RETURNING *`,
            [req.tenantId, req.params.id, outcome]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_complete' });
        res.json({ ok: true, visit: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/visits/patient/:patientId', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT * FROM visit_lifecycle WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 30`,
            [req.tenantId, req.params.patientId]
        );
        res.json({ ok: true, count: r.rows.length, latest: r.rows[0] || null, history: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/waiting', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { department, hours = 4 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT v.*, p.full_name AS patient_full_name FROM visit_lifecycle v LEFT JOIN patients p ON p.id = v.patient_id
                   WHERE v.tenant_id = $1 AND v.status IN ('arrived','triaged') AND v.created_at >= NOW() - ($2 || ' hours')::INTERVAL`;
        params.push(hours);
        if (department) { sql += ` AND v.department = $${params.length + 1}`; params.push(department); }
        sql += ` ORDER BY v.triage_level ASC, v.arrived_at ASC`;
        const r = await db.query(sql, params);
        const enriched = r.rows.map(x => {
            const waitMins = x.triage_at ? Math.round((Date.now() - new Date(x.triage_at).getTime()) / 60000) : Math.round((Date.now() - new Date(x.arrived_at).getTime()) / 60000);
            return { ...x, waiting_minutes: waitMins, exceeding_sla: waitMins > 30 };
        });
        res.json({ ok: true, count: enriched.length, rows: enriched, sla_threshold_minutes: 30 });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/in-consult', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT v.*, p.full_name AS patient_full_name FROM visit_lifecycle v LEFT JOIN patients p ON p.id = v.patient_id
             WHERE v.tenant_id = $1 AND v.status = 'in_consult' ORDER BY v.consult_start ASC`,
            [req.tenantId]
        );
        const withDuration = r.rows.map(x => ({ ...x, in_consult_minutes: x.consult_start ? Math.round((Date.now() - new Date(x.consult_start).getTime()) / 60000) : 0 }));
        res.json({ ok: true, count: withDuration.length, rows: withDuration });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT status, COUNT(*) AS count, AVG(EXTRACT(EPOCH FROM (triage_at - arrived_at))/60)::NUMERIC(10,2) AS avg_wait_to_triage_min,
                    AVG(EXTRACT(EPOCH FROM (consult_start - triage_at))/60)::NUMERIC(10,2) AS avg_triage_to_consult_min
             FROM visit_lifecycle WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY status`,
            [req.tenantId]
        );
        const triageDist = await db.query(
            `SELECT triage_level, COUNT(*) AS count FROM visit_lifecycle WHERE tenant_id = $1 AND triage_level IS NOT NULL AND created_at >= NOW() - INTERVAL '90 days'
             GROUP BY triage_level ORDER BY triage_level`,
            [req.tenantId]
        );
        res.json({ ok: true, status_breakdown: r.rows, triage_distribution: triageDist.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
