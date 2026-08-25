// filepath: namaweb/incident_router.js
// Incident reports management (clinical + safety + SAC-classified).
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// GET /api/incident?severity=high&status=open
router.get('/', requireAuth, requireTenantScope, requireRole('admin', 'quality', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { severity, status, sac_classification, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (severity) { params.push(severity); conditions.push(`severity = $${params.length}`); }
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (sac_classification) { params.push(sac_classification); conditions.push(`sac_classification = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`incident_datetime >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, incident_type, sac_classification, incident_datetime, location, description,
                   immediate_actions, is_anonymous, reporter_id, reporter_name, status, rca_status,
                   created_at
            FROM incident_reports
            WHERE ${conditions.join(' AND ')}
            ORDER BY incident_datetime DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, incidents: r.rows });
    } catch (err) { console.error('GET /api/incident', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/incident/open — unresolved incidents
router.get('/open', requireAuth, requireTenantScope, requireRole('admin', 'quality'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, incident_type, sac_classification, severity, incident_datetime, location,
                   description, status, rca_status, created_at
            FROM incident_reports
            WHERE tenant_id = $1 AND status NOT IN ('closed', 'resolved')
            ORDER BY incident_datetime DESC LIMIT 200
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, incidents: r.rows });
    } catch (err) { console.error('GET /api/incident/open', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/incident
router.post('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin', 'quality'), async (req, res) => {
    try {
        const { incident_type, sac_classification, incident_datetime, location, description, immediate_actions, is_anonymous } = req.body;
        if (!incident_type || !description) return res.status(400).json({ error: 'missing_required', required: ['incident_type', 'description'] });
        const r = await db.query(`
            INSERT INTO incident_reports (tenant_id, incident_type, sac_classification, incident_datetime, location, description, immediate_actions, is_anonymous, reporter_id, reporter_name, status, rca_status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'open','not_started') RETURNING id
        `, [req.tenantId, incident_type, sac_classification || 'SAC2', incident_datetime || new Date().toISOString(), location || '', description, immediate_actions || '', is_anonymous || false, req.userId, req.userName || 'unknown']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/incident', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/incident/:id/rca — start root-cause analysis
router.post('/:id/rca', requireAuth, requireTenantScope, requireRole('admin', 'quality'), async (req, res) => {
    try {
        const { rca_notes } = req.body;
        const r = await db.query(`
            UPDATE incident_reports SET rca_status = 'in_progress', rca_notes = COALESCE($3, rca_notes), updated_at = NOW()
            WHERE id = $1 AND tenant_id = $2 AND rca_status = 'not_started' RETURNING id, rca_status, updated_at
        `, [req.params.id, req.tenantId, rca_notes || null]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_rca_already_started' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/incident/:id/rca', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/incident/:id/close
router.post('/:id/close', requireAuth, requireTenantScope, requireRole('admin', 'quality'), async (req, res) => {
    try {
        const { closure_notes } = req.body;
        const r = await db.query(`
            UPDATE incident_reports SET status = 'closed', rca_status = COALESCE(NULLIF(rca_status, 'not_started'), rca_status), updated_at = NOW()
            WHERE id = $1 AND tenant_id = $2 AND status != 'closed' RETURNING id, status, updated_at
        `, [req.params.id, req.tenantId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_already_closed' });
        // Store closure notes in rca_notes if not already set
        if (closure_notes) {
            await db.query(`UPDATE incident_reports SET rca_notes = COALESCE(rca_notes || E'\n[CLOSE] ', '') || $2 WHERE id = $1`, [req.params.id, closure_notes]);
        }
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/incident/:id/close', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/incident/nursing — nursing risk assessments (falls, pressure ulcers)
router.get('/nursing', requireAuth, requireTenantScope, requireRole('admin', 'nurse', 'quality'), async (req, res) => {
    try {
        const { risk_level, assessment_type } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (risk_level) { params.push(risk_level); conditions.push(`risk_level = $${params.length}`); }
        if (assessment_type) { params.push(assessment_type); conditions.push(`assessment_type = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, admission_id, assessment_type, total_score, risk_level,
                   details, assessed_by, created_at
            FROM nursing_risk_assessments
            WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/incident/nursing', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/incident/stats
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'quality'), async (req, res) => {
    try {
        const inc = await db.query(`
            SELECT COUNT(*) as total,
                   COUNT(*) FILTER (WHERE status = 'open') as open_count,
                   COUNT(*) FILTER (WHERE status = 'closed') as closed_count,
                   COUNT(*) FILTER (WHERE rca_status = 'in_progress') as rca_in_progress,
                   COUNT(*) FILTER (WHERE rca_status = 'completed') as rca_completed,
                   COUNT(*) FILTER (WHERE sac_classification IN ('SAC4','SAC5')) as serious
            FROM incident_reports WHERE tenant_id = $1
        `, [req.tenantId]);
        const byType = await db.query(`
            SELECT incident_type, COUNT(*) as cnt FROM incident_reports
            WHERE tenant_id = $1 GROUP BY incident_type ORDER BY cnt DESC LIMIT 10
        `, [req.tenantId]);
        const nursing = await db.query(`
            SELECT risk_level, COUNT(*) as cnt FROM nursing_risk_assessments
            WHERE tenant_id = $1 GROUP BY risk_level ORDER BY risk_level
        `, [req.tenantId]);
        res.json({ ok: true, summary: inc.rows[0], by_type: byType.rows, nursing_by_risk: nursing.rows });
    } catch (err) { console.error('GET /api/incident/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['list', 'open', 'create', 'rca', 'close', 'nursing', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
