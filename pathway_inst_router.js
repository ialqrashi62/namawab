'use strict';
// Wave 94 — Clinical Pathway Instances: per-patient pathway execution tracking
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_STATUS = ['in_progress','paused','completed','cancelled','abandoned'];
const VALID_STEP_STATE = ['pending','in_progress','completed','skipped','failed'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'pathway-instances',
        endpoints: [
            'GET /instances',
            'GET /instances/:id',
            'POST /instances',
            'POST /instances/:id/advance',
            'POST /instances/:id/complete',
            'POST /instances/:id/cancel',
            'GET /instances/patient/:patientId',
            'GET /active',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

router.get('/instances', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, pathway_id, status, started_by, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT pi.*, p.full_name AS patient_name, p.mrn, cp.code AS pathway_code, cp.name_en AS pathway_name,
                          u.full_name AS starter_name FROM clinical_pathway_instances pi
                   LEFT JOIN patients p ON p.id = pi.patient_id
                   LEFT JOIN clinical_pathways cp ON cp.id = pi.pathway_id
                   LEFT JOIN users u ON u.id = pi.started_by WHERE pi.tenant_id = $1`;
        if (patient_id) { sql += ` AND pi.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (pathway_id) { sql += ` AND pi.pathway_id = $${params.length + 1}`; params.push(pathway_id); }
        if (status) { sql += ` AND pi.status = $${params.length + 1}`; params.push(status); }
        if (started_by) { sql += ` AND pi.started_by = $${params.length + 1}`; params.push(started_by); }
        sql += ` ORDER BY pi.started_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(x => ({
            ...x,
            duration_hours: x.completed_at && x.started_at ? Math.round((new Date(x.completed_at) - new Date(x.started_at)) / 3600000 * 10) / 10 : null
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/instances/:id', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT pi.*, p.full_name AS patient_name, p.mrn, cp.code AS pathway_code, cp.name_en AS pathway_name,
                    cp.steps AS pathway_steps, u.full_name AS starter_name FROM clinical_pathway_instances pi
             LEFT JOIN patients p ON p.id = pi.patient_id
             LEFT JOIN clinical_pathways cp ON cp.id = pi.pathway_id
             LEFT JOIN users u ON u.id = pi.started_by
             WHERE pi.tenant_id = $1 AND pi.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'instance_not_found' });
        let pathwaySteps = [];
        try { pathwaySteps = typeof r.rows[0].pathway_steps === 'string' ? JSON.parse(r.rows[0].pathway_steps) : r.rows[0].pathway_steps || []; } catch (e) { pathwaySteps = []; }
        const currentStep = pathwaySteps.find(s => s.order === r.rows[0].current_step) || null;
        res.json({ ok: true, instance: r.rows[0], current_step: currentStep, total_steps: pathwaySteps.length });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/instances', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { pathway_id, patient_id, started_by } = req.body;
        if (!pathway_id) return res.status(400).json({ ok: false, error: 'pathway_id_required' });
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });

        const pathway = await db.query(`SELECT id, steps FROM clinical_pathways WHERE tenant_id = $1 AND id = $2 AND active = true`, [req.tenantId, pathway_id]);
        if (!pathway.rows.length) return res.status(404).json({ ok: false, error: 'pathway_not_found_or_inactive' });
        let steps = [];
        try { steps = typeof pathway.rows[0].steps === 'string' ? JSON.parse(pathway.rows[0].steps) : pathway.rows[0].steps || []; } catch (e) { steps = []; }

        const firstStep = steps.length ? steps[0].order : 1;
        const stepState = steps.reduce((acc, s) => { acc[s.order] = 'pending'; return acc; }, {});

        const r = await db.query(
            `INSERT INTO clinical_pathway_instances (tenant_id, pathway_id, patient_id, started_by, current_step, step_state, status, started_at)
             VALUES ($1,$2,$3,$4,$5,$6,'in_progress',NOW()) RETURNING *`,
            [req.tenantId, pathway_id, patient_id, started_by || req.user?.id || null, firstStep, stepState]
        );
        res.status(201).json({ ok: true, instance: r.rows[0], total_steps: steps.length, first_step_order: firstStep });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/instances/:id/advance', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { next_step, completed_step_state = 'completed' } = req.body;
        if (!next_step) return res.status(400).json({ ok: false, error: 'next_step_required' });
        if (!VALID_STEP_STATE.includes(completed_step_state)) return res.status(400).json({ ok: false, error: 'invalid_completed_step_state' });

        const cur = await db.query(`SELECT step_state FROM clinical_pathway_instances WHERE tenant_id = $1 AND id = $2`, [req.tenantId, req.params.id]);
        if (!cur.rows.length) return res.status(404).json({ ok: false, error: 'instance_not_found' });
        let stepState = cur.rows[0].step_state || {};
        if (typeof stepState === 'string') { try { stepState = JSON.parse(stepState); } catch (e) { stepState = {}; } }

        const prevStep = Object.keys(stepState).reduce((max, k) => Math.max(max, parseInt(k) || 0), 0);
        if (prevStep) stepState[prevStep] = completed_step_state;
        stepState[next_step] = 'in_progress';

        const r = await db.query(
            `UPDATE clinical_pathway_instances SET current_step = $3, step_state = $4, updated_at = NOW()
             WHERE tenant_id = $1 AND id = $2 AND status = 'in_progress' RETURNING *`,
            [req.tenantId, req.params.id, next_step, stepState]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_advance' });
        res.json({ ok: true, instance: r.rows[0], step_state: stepState });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/instances/:id/complete', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const cur = await db.query(`SELECT step_state FROM clinical_pathway_instances WHERE tenant_id = $1 AND id = $2`, [req.tenantId, req.params.id]);
        if (!cur.rows.length) return res.status(404).json({ ok: false, error: 'instance_not_found' });
        let stepState = cur.rows[0].step_state || {};
        if (typeof stepState === 'string') { try { stepState = JSON.parse(stepState); } catch (e) { stepState = {}; } }
        Object.keys(stepState).forEach(k => { stepState[k] = 'completed'; });

        const r = await db.query(
            `UPDATE clinical_pathway_instances SET status = 'completed', completed_at = NOW(), step_state = $3, updated_at = NOW()
             WHERE tenant_id = $1 AND id = $2 AND status = 'in_progress' RETURNING *`,
            [req.tenantId, req.params.id, stepState]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_complete' });
        const dur = r.rows[0].completed_at && r.rows[0].started_at ? Math.round((new Date(r.rows[0].completed_at) - new Date(r.rows[0].started_at)) / 3600000 * 10) / 10 : null;
        res.json({ ok: true, instance: r.rows[0], duration_hours: dur });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/instances/:id/cancel', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { reason } = req.body;
        const r = await db.query(
            `UPDATE clinical_pathway_instances SET status = 'cancelled', completed_at = NOW(), updated_at = NOW()
             WHERE tenant_id = $1 AND id = $2 AND status IN ('in_progress','paused') RETURNING *`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_cancel' });
        res.json({ ok: true, instance: r.rows[0], cancelled_reason: reason || null });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/instances/patient/:patientId', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT pi.*, cp.code AS pathway_code, cp.name_en AS pathway_name FROM clinical_pathway_instances pi
             LEFT JOIN clinical_pathways cp ON cp.id = pi.pathway_id
             WHERE pi.tenant_id = $1 AND pi.patient_id = $2 ORDER BY pi.started_at DESC`,
            [req.tenantId, req.params.patientId]
        );
        res.json({ ok: true, count: r.rows.length, active: r.rows.filter(x => x.status === 'in_progress'), completed: r.rows.filter(x => x.status === 'completed'), history: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/active', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT pi.*, p.full_name AS patient_name, cp.code AS pathway_code FROM clinical_pathway_instances pi
             LEFT JOIN patients p ON p.id = pi.patient_id LEFT JOIN clinical_pathways cp ON cp.id = pi.pathway_id
             WHERE pi.tenant_id = $1 AND pi.status = 'in_progress' ORDER BY pi.started_at ASC LIMIT 100`,
            [req.tenantId]
        );
        const withWait = r.rows.map(x => ({ ...x, hours_in_pathway: Math.round((Date.now() - new Date(x.started_at).getTime()) / 3600000 * 10) / 10 }));
        res.json({ ok: true, count: withWait.length, rows: withWait });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT status, COUNT(*) AS count, AVG(EXTRACT(EPOCH FROM (completed_at - started_at))/3600)::NUMERIC(10,2) AS avg_duration_hours
             FROM clinical_pathway_instances WHERE tenant_id = $1 AND started_at >= NOW() - INTERVAL '90 days' GROUP BY status`,
            [req.tenantId]
        );
        const byPathway = await db.query(
            `SELECT cp.code, cp.name_en, COUNT(*) AS count, AVG(EXTRACT(EPOCH FROM (pi.completed_at - pi.started_at))/3600)::NUMERIC(10,2) AS avg_hours
             FROM clinical_pathway_instances pi JOIN clinical_pathways cp ON cp.id = pi.pathway_id
             WHERE pi.tenant_id = $1 AND pi.started_at >= NOW() - INTERVAL '90 days' GROUP BY cp.code, cp.name_en ORDER BY count DESC LIMIT 15`,
            [req.tenantId]
        );
        res.json({ ok: true, status_breakdown: r.rows, by_pathway: byPathway.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
