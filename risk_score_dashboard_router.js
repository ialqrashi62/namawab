'use strict';
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Global risk-score dashboard
router.get('/dashboard', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'quality'), async (req, res) => {
    try {
        const fin = await db.query(`SELECT tenant_id, table_name, fin.calc_date FROM (SELECT DISTINCT tenant_id, 'consent' as table_name, CURRENT_DATE as calc_date) fin LIMIT 1`, []).catch(() => ({ rows: [] }));
        // Real stats: count alerts + critical findings across modules
        const m = await db.query(`
            SELECT
                (SELECT COUNT(*) FROM incident_reports WHERE tenant_id = $1 AND status = 'open') as open_incidents,
                (SELECT COUNT(*) FROM nursing_risk_assessments WHERE tenant_id = $1 AND risk_level = 'high') as high_nursing_risks,
                (SELECT COUNT(*) FROM cds_alerts WHERE tenant_id = $1 AND status = 'open') as open_cds_alerts,
                (SELECT COUNT(*) FROM quality_risk_register WHERE tenant_id = $1 AND risk_level = 'critical') as critical_risks,
                (SELECT COUNT(*) FROM drug_interaction_checks WHERE tenant_id = $1 AND highest_severity IN ('major','severe')) as drug_interact_30d,
                (SELECT COUNT(*) FROM controlled_drug_log WHERE tenant_id = $1 AND at >= NOW() - INTERVAL '30 days') as controlled_30d
        `, [req.tenantId]);
        const safety = await db.query(`
            SELECT
                (SELECT COUNT(*) FROM hai_isolation WHERE tenant_id = $1 AND status = 'active') as active_isolations,
                (SELECT COUNT(*) FROM infection_outbreaks WHERE tenant_id = $1 AND status = 'active') as active_outbreaks,
                (SELECT COUNT(*) FROM emergency_visits WHERE tenant_id = $1 AND acuity = 'critical' AND status = 'waiting') as critical_waiting
        `, [req.tenantId]);
        res.json({ ok: true, risk_summary: m.rows[0], safety_summary: safety.rows[0], dashboard_date: new Date().toISOString().substring(0, 10) });
    } catch (err) { console.error('GET /api/rsd/dashboard', err); res.status(500).json({ error: 'internal_error' }); }
});

// Generic risk-score register
router.get('/risk-register', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'quality'), async (req, res) => {
    try {
        const { risk_level, status } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (risk_level) { params.push(risk_level); conditions.push(`risk_level = $${params.length}`); }
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, incident_id, risk_title, category, likelihood, impact, risk_score, risk_level,
                   control_measure, residual_likelihood, residual_impact, residual_score,
                   owner_name, review_date, status, created_by, created_at
            FROM quality_risk_register WHERE ${conditions.join(' AND ')}
            ORDER BY risk_score DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, risks: r.rows });
    } catch (err) { console.error('GET /api/rsd/risk-register', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/risk-register', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'quality'), async (req, res) => {
    try {
        const { risk_title, category, likelihood, impact, control_measure, owner_name, review_date } = req.body;
        if (!risk_title || likelihood == null || impact == null) return res.status(400).json({ error: 'missing_required' });
        const score = +likelihood * +impact;
        const level = score >= 15 ? 'extreme' : score >= 10 ? 'high' : score >= 5 ? 'medium' : 'low';
        const r = await db.query(`
            INSERT INTO quality_risk_register (tenant_id, risk_title, category, likelihood, impact, risk_score, risk_level, control_measure, owner_name, review_date, status, created_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'active',$11) RETURNING id, risk_score, risk_level
        `, [req.tenantId, risk_title, category || '', likelihood, impact, score, level, control_measure || '', owner_name || '', review_date || null, req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id, risk_score: r.rows[0].risk_score, risk_level: r.rows[0].risk_level });
    } catch (err) { console.error('POST /api/rsd/risk-register', err); res.status(500).json({ error: 'internal_error' }); }
});

// BMI tracking
router.get('/bmi/:patient_id', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, recorded_at, weight_kg, height_cm, bmi, category FROM (SELECT id, recorded_at, weight_kg, height_cm, ROUND((weight_kg::numeric / POWER(height_cm::numeric/100, 2))::numeric, 2) as bmi, CASE WHEN (weight_kg::numeric / POWER(height_cm::numeric/100, 2)) < 18.5 THEN 'underweight' WHEN (weight_kg::numeric / POWER(height_cm::numeric/100, 2)) < 25 THEN 'normal' WHEN (weight_kg::numeric / POWER(height_cm::numeric/100, 2)) < 30 THEN 'overweight' WHEN (weight_kg::numeric / POWER(height_cm::numeric/100, 2)) < 35 THEN 'obesity_1' WHEN (weight_kg::numeric / POWER(height_cm::numeric/100, 2)) < 40 THEN 'obesity_2' ELSE 'obesity_3' END as category FROM vital_signs WHERE tenant_id = $1 AND patient_id = $2 AND weight_kg IS NOT NULL AND height_cm IS NOT NULL) sub ORDER BY recorded_at DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, measurements: r.rows });
    } catch (err) { console.error('GET /api/rsd/bmi', err); res.status(500).json({ error: 'internal_error' }); }
});

// Heat map of open risks by domain
router.get('/risk-heatmap', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'quality'), async (req, res) => {
    try {
        const r = await db.query(`SELECT category, risk_level, COUNT(*) as count FROM quality_risk_register WHERE tenant_id = $1 AND status = 'active' GROUP BY category, risk_level ORDER BY category, risk_level`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, heatmap: r.rows });
    } catch (err) { console.error('GET /api/rsd/risk-heatmap', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['dashboard', 'risk-register', 'bmi', 'risk-heatmap'], timestamp: new Date().toISOString() });
});

module.exports = router;
