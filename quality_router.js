// filepath: namaweb/quality_router.js
// Quality + safety: KPIs + incidents + CAPA + risk register + satisfaction.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// KPI tracking (target vs actual)
router.post('/kpis', requireAuth, requireTenantScope, requireRole('quality_officer', 'admin'), async (req, res) => {
    try {
        const { kpi_name, kpi_name_ar, category, target_value, actual_value, unit, period, department, status, notes } = req.body;
        if (!kpi_name || !period) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO quality_kpis (tenant_id, kpi_name, kpi_name_ar, category, target_value, actual_value, unit, period, department, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`, [req.tenantId, kpi_name, kpi_name_ar || '', category || '', target_value || 0, actual_value || 0, unit || '', period, department || '', status || 'on_target', notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/qs/kpis', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/kpis', requireAuth, requireTenantScope, requireRole('quality_officer', 'admin', 'doctor'), async (req, res) => {
    try {
        const { category, department, period } = req.query;
        let sql = `SELECT id, kpi_name, kpi_name_ar, category, target_value, actual_value, unit, period, department, status FROM quality_kpis WHERE tenant_id = $1`;
        const params = [req.tenantId];
        if (category) { params.push(category); sql += ` AND category = $${params.length}`; }
        if (department) { params.push(department); sql += ` AND department = $${params.length}`; }
        if (period) { params.push(period); sql += ` AND period = $${params.length}`; }
        sql += ` ORDER BY period DESC LIMIT 200`;
        const r = await db.query(sql, params);
        res.json({ ok: true, total: r.rows.length, kpis: r.rows });
    } catch (err) { console.error('GET /api/qs/kpis', err); res.status(500).json({ error: 'internal_error' }); }
});

// Incidents (near-misses / adverse events)
router.post('/incidents', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'admin', 'quality_officer'), async (req, res) => {
    try {
        const { incident_type, incident_datetime, location, description, immediate_actions, severity, is_anonymous, reporter_name } = req.body;
        if (!incident_type || !description) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO incident_reports (tenant_id, incident_type, incident_datetime, location, description, immediate_actions, sac_classification, is_anonymous, reporter_name, status) VALUES ($1, $2, COALESCE($3, NOW()), $4, $5, $6, $7, COALESCE($8, false), $9, 'open') RETURNING id`, [req.tenantId, incident_type, incident_datetime || null, location || '', description, immediate_actions || '', severity || '', is_anonymous || false, reporter_name || req.userName || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/qs/incidents', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/incidents', requireAuth, requireTenantScope, requireRole('quality_officer', 'admin', 'risk_manager'), async (req, res) => {
    try {
        const { status, severity } = req.query;
        let sql = `SELECT id, incident_type, incident_datetime, location, sac_classification, description, is_anonymous, reporter_name, status, rca_status FROM incident_reports WHERE tenant_id = $1`;
        const params = [req.tenantId];
        if (status) { params.push(status); sql += ` AND status = $${params.length}`; }
        if (severity) { params.push(severity); sql += ` AND sac_classification = $${params.length}`; }
        sql += ` ORDER BY incident_datetime DESC LIMIT 200`;
        const r = await db.query(sql, params);
        res.json({ ok: true, total: r.rows.length, incidents: r.rows });
    } catch (err) { console.error('GET /api/qs/incidents', err); res.status(500).json({ error: 'internal_error' }); }
});

// Incident closure + RCA status
router.post('/incidents/:id/close', requireAuth, requireTenantScope, requireRole('quality_officer', 'risk_manager'), async (req, res) => {
    try {
        const { status, rca_status, rca_notes } = req.body;
        const r = await db.query(`UPDATE incident_reports SET status = COALESCE($2, status), rca_status = COALESCE($3, rca_status), rca_notes = COALESCE($4, rca_notes) WHERE tenant_id = $1 AND id = $5 RETURNING id, status`, [req.tenantId, status || 'closed', rca_status || null, rca_notes || null, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/qs/incidents/close', err); res.status(500).json({ error: 'internal_error' }); }
});

// CAPA (Corrective and Preventive Actions)
router.post('/capa', requireAuth, requireTenantScope, requireRole('quality_officer', 'admin'), async (req, res) => {
    try {
        const { incident_id, capa_type, title, description, root_cause, owner_name, due_date } = req.body;
        if (!title) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO quality_capa (tenant_id, incident_id, capa_type, title, description, root_cause, owner_name, due_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'open') RETURNING id`, [req.tenantId, incident_id || null, capa_type || 'corrective', title, description || '', root_cause || '', owner_name || '', due_date || null]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/qs/capa', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/capa/:id/complete', requireAuth, requireTenantScope, requireRole('quality_officer', 'owner'), async (req, res) => {
    try {
        const { completion_notes } = req.body;
        const r = await db.query(`UPDATE quality_capa SET status = 'completed', completion_notes = $2, completion_date = NOW() WHERE tenant_id = $1 AND id = $3 RETURNING id, status`, [req.tenantId, completion_notes || '', req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/qs/capa/complete', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/capa', requireAuth, requireTenantScope, requireRole('quality_officer', 'admin'), async (req, res) => {
    try {
        const { status } = req.query;
        let sql = `SELECT id, incident_id, capa_type, title, root_cause, owner_name, due_date, status, completion_date FROM quality_capa WHERE tenant_id = $1`;
        const params = [req.tenantId];
        if (status) { params.push(status); sql += ` AND status = $${params.length}`; }
        sql += ` ORDER BY created_at DESC LIMIT 200`;
        const r = await db.query(sql, params);
        res.json({ ok: true, total: r.rows.length, capa: r.rows });
    } catch (err) { console.error('GET /api/qs/capa', err); res.status(500).json({ error: 'internal_error' }); }
});

// Risk register (5x5 matrix scoring)
router.post('/risk', requireAuth, requireTenantScope, requireRole('risk_manager', 'quality_officer', 'admin'), async (req, res) => {
    try {
        const { incident_id, risk_title, category, likelihood, impact, control_measure, owner_name } = req.body;
        if (!risk_title) return res.status(400).json({ error: 'missing_required' });
        const l = +likelihood || 1, i = +impact || 1;
        const score = l * i;
        const level = score >= 16 ? 'critical' : score >= 9 ? 'high' : score >= 4 ? 'moderate' : 'low';
        const r = await db.query(`INSERT INTO quality_risk_register (tenant_id, incident_id, risk_title, category, likelihood, impact, risk_score, risk_level, control_measure, owner_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, risk_level`, [req.tenantId, incident_id || null, risk_title, category || '', l, i, score, level, control_measure || '', owner_name || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id, risk_score: score, risk_level: r.rows[0].risk_level });
    } catch (err) { console.error('POST /api/qs/risk', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/risk', requireAuth, requireTenantScope, requireRole('risk_manager', 'admin', 'quality_officer'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, risk_title, category, risk_score, risk_level, residual_score, owner_name, status FROM quality_risk_register WHERE tenant_id = $1 ORDER BY risk_score DESC LIMIT 200`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, risks: r.rows });
    } catch (err) { console.error('GET /api/qs/risk', err); res.status(500).json({ error: 'internal_error' }); }
});

// Patient satisfaction (post-discharge survey)
router.get('/satisfaction', requireAuth, requireTenantScope, requireRole('quality_officer', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT department, COUNT(*) as total, ROUND(AVG(overall_rating)::numeric, 2) as avg_overall, ROUND(AVG(wait_time)::numeric, 2) as avg_wait, SUM(CASE WHEN would_recommend = true THEN 1 ELSE 0 END) as recommend_count FROM quality_patient_satisfaction WHERE tenant_id = $1 AND survey_date >= NOW() - INTERVAL '90 days' GROUP BY department ORDER BY avg_overall DESC`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, departments: r.rows });
    } catch (err) { console.error('GET /api/qs/satisfaction', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['kpis', 'incidents', 'capa', 'risk', 'satisfaction'], timestamp: new Date().toISOString() });
});

module.exports = router;
