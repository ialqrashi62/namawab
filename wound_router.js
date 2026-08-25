// filepath: namaweb/wound_router.js
// Wound care assessments: staging (pressure ulcer grades 1-4) + size tracking + trend analysis.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Wound assessment with healing tracking
router.post('/assess', requireAuth, requireTenantScope, requireRole('nurse', 'wound_nurse', 'doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, wound_type, stage_grade, size_cm, exudate, healing_progress, notes } = req.body;
        if (!patient_id || !wound_type) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO wound_assessments (tenant_id, patient_id, encounter_id, wound_type, stage_grade, size_cm, exudate, healing_progress, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`, [req.tenantId, patient_id, encounter_id || null, wound_type, stage_grade || '', size_cm || '', exudate || '', healing_progress || '', notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/wnd/assess', err); res.status(500).json({ error: 'internal_error' }); }
});

// Patient history (healing trajectory)
router.get('/history/:patient_id', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'wound_nurse'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, encounter_id, wound_type, stage_grade, size_cm, exudate, healing_progress, notes, created_at FROM wound_assessments WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 100`, [req.tenantId, req.params.patient_id]);
        // Compute trend: worsening vs improving
        const trend = { improving: 0, stable: 0, worsening: 0 };
        for (let i = 0; i < r.rows.length - 1; i++) {
            const cur = r.rows[i];
            const prev = r.rows[i + 1];
            const curN = cur.size_cm && parseFloat(cur.size_cm);
            const prevN = prev.size_cm && parseFloat(prev.size_cm);
            if (curN && prevN) {
                if (curN < prevN - 0.5) trend.improving++;
                else if (curN > prevN + 0.5) trend.worsening++;
                else trend.stable++;
            }
        }
        res.json({ ok: true, total: r.rows.length, assessments: r.rows, trend });
    } catch (err) { console.error('GET /api/wnd/history', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/active/:patient_id', requireAuth, requireTenantScope, requireRole('nurse', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`SELECT DISTINCT ON (wound_type) id, wound_type, stage_grade, size_cm, exudate, healing_progress, created_at FROM wound_assessments WHERE tenant_id = $1 AND patient_id = $2 ORDER BY wound_type, created_at DESC LIMIT 20`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, active_wounds: r.rows });
    } catch (err) { console.error('GET /api/wnd/active', err); res.status(500).json({ error: 'internal_error' }); }
});

// Risk scoring (Braden-like — simplified)
const BRADEN_RISK = (subscales) => {
    let score = 23;
    Object.values(subscales || {}).forEach(v => { score -= 4 - (+v || 4); });
    if (score >= 19) return 'no_risk';
    if (score >= 15) return 'mild';
    if (score >= 13) return 'moderate';
    if (score >= 10) return 'high';
    return 'very_high';
};

router.post('/braden', requireAuth, requireTenantScope, requireRole('nurse', 'doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, subscales, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required' });
        const score = 23 - Object.values(subscales || {}).reduce((s, v) => s + (4 - (+v || 4)), 0);
        const risk = BRADEN_RISK(subscales);
        const r = await db.query(`INSERT INTO wound_care_assessments (tenant_id, patient_id, encounter_id, performed_by, score, risk_level) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`, [req.tenantId, patient_id, encounter_id || null, performed_by || req.userName || '', score, risk]);
        res.status(201).json({ ok: true, id: r.rows[0].id, score, risk_level: risk });
    } catch (err) { console.error('POST /api/wnd/braden', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/braden/:patient_id', requireAuth, requireTenantScope, requireRole('nurse', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`SELECT score, risk_level, performed_by, created_at FROM wound_care_assessments WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, scores: r.rows });
    } catch (err) { console.error('GET /api/wnd/braden', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['assess', 'history', 'active', 'braden'], timestamp: new Date().toISOString() });
});

module.exports = router;
