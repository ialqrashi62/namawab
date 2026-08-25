// filepath: namaweb/pathway_router.js
// Clinical pathways (multi-step protocols: MI, stroke, sepsis, etc.)
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { department, active } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (department) { params.push(department); conditions.push(`department = $${params.length}`); }
        if (active === 'true') conditions.push('active = true');
        if (active === 'false') conditions.push('active = false');
        params.push(Math.min(+req.query.limit || 50, 200));
        const r = await db.query(`
            SELECT id, code, name_en, name_ar, department, description, version, active, created_at
            FROM clinical_pathways
            WHERE ${conditions.join(' AND ')}
            ORDER BY name_en LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, pathways: r.rows });
    } catch (err) { console.error('GET /api/pathway', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/:id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, code, name_en, name_ar, department, description, steps, version, active, created_at FROM clinical_pathways WHERE id = $1 AND tenant_id = $2`, [req.params.id, req.tenantId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        const p = r.rows[0];
        let steps = [];
        try { if (p.steps && typeof p.steps === 'string' && p.steps.startsWith('[')) steps = JSON.parse(p.steps); } catch(e) {}
        res.json({ ok: true, id: p.id, code: p.code, name_en: p.name_en, name_ar: p.name_ar, department: p.department, description: p.description, steps, version: p.version, active: p.active, created_at: p.created_at });
    } catch (err) { console.error('GET /api/pathway/:id', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/instances/active', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT pi.id, pi.pathway_id, p.name_en, p.name_ar, pi.patient_id, pi.current_step,
                   pi.step_state, pi.status, pi.started_at, pi.started_by
            FROM clinical_pathway_instances pi
            LEFT JOIN clinical_pathways p ON p.id = pi.pathway_id
            WHERE pi.tenant_id = $1 AND pi.status = 'in_progress'
            ORDER BY pi.started_at DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, instances: r.rows });
    } catch (err) { console.error('GET /api/pathway/instances/active', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/:id/start', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const { patient_id } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required', required: ['patient_id'] });
        const r = await db.query(`
            INSERT INTO clinical_pathway_instances (tenant_id, pathway_id, patient_id, started_by, current_step, step_state, status, started_at)
            VALUES ($1, $2, $3, $4, 1, '{}', 'in_progress', NOW()) RETURNING id
        `, [req.tenantId, req.params.id, patient_id, req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/pathway/:id/start', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/instances/:id/step', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { advance } = req.body;
        if (advance) {
            const r = await db.query(`
                UPDATE clinical_pathway_instances
                SET current_step = current_step + 1, updated_at = NOW()
                WHERE id = $1 AND tenant_id = $2 AND status = 'in_progress'
                RETURNING id, current_step, step_state
            `, [req.params.id, req.tenantId]);
            if (r.rows.length === 0) return res.status(404).json({ error: 'instance_not_found_or_not_active' });
            return res.json({ ok: true, ...r.rows[0] });
        }
        const r = await db.query(`SELECT id, current_step, step_state FROM clinical_pathway_instances WHERE id = $1 AND tenant_id = $2`, [req.params.id, req.tenantId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/pathway/instances/:id/step', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/instances/:id/complete', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE clinical_pathway_instances SET status = 'completed', completed_at = NOW(), updated_at = NOW()
            WHERE id = $1 AND tenant_id = $2 AND status != 'completed' RETURNING id, status, completed_at
        `, [req.params.id, req.tenantId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_already_completed' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/pathway/instances/:id/complete', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/instances/:id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT pi.id, pi.pathway_id, pi.patient_id, pi.current_step, pi.step_state, pi.status,
                   pi.started_at, pi.started_by, pi.completed_at, p.name_en as pathway_name, p.name_ar as pathway_name_ar, p.steps
            FROM clinical_pathway_instances pi
            LEFT JOIN clinical_pathways p ON p.id = pi.pathway_id
            WHERE pi.id = $1 AND pi.tenant_id = $2
        `, [req.params.id, req.tenantId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        const inst = r.rows[0];
        let steps = [];
        try { if (inst.steps && typeof inst.steps === 'string' && inst.steps.startsWith('[')) steps = JSON.parse(inst.steps); } catch(e) {}
        res.json({ ok: true, instance: { ...inst, steps } });
    } catch (err) { console.error('GET /api/pathway/instances/:id', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['list', 'get', 'instances/active', 'start', 'step', 'complete', 'instance'], timestamp: new Date().toISOString() });
});

module.exports = router;
