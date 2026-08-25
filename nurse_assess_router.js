'use strict';
// Wave 88 — Nursing Assessments: shift-based composite scoring
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_TYPES = ['admission','shift','focused','discharge','transfer','routine'];
const VALID_SHIFTS = ['morning','evening','night'];

function fallRiskCategory(score) {
    if (score === null || score === undefined) return null;
    if (score >= 45) return 'high';
    if (score >= 25) return 'moderate';
    return 'low';
}

function bradenCategory(score) {
    if (score === null || score === undefined) return null;
    if (score >= 19) return 'no_risk';
    if (score >= 15) return 'mild';
    if (score >= 13) return 'moderate';
    if (score >= 10) return 'high';
    return 'very_high';
}

function gcsCategory(score) {
    if (score === null || score === undefined) return null;
    if (score === 15) return 'normal';
    if (score >= 13) return 'mild_impairment';
    if (score >= 9) return 'moderate_impairment';
    if (score >= 3) return 'severe_impairment';
    return null;
}

function compositeFlags(row) {
    const flags = [];
    const fr = fallRiskCategory(row.fall_risk_score);
    if (fr === 'high') flags.push({ type: 'fall_risk', level: 'high', value: row.fall_risk_score });
    else if (fr === 'moderate') flags.push({ type: 'fall_risk', level: 'moderate', value: row.fall_risk_score });
    const br = bradenCategory(row.braden_score);
    if (br === 'high' || br === 'very_high') flags.push({ type: 'pressure_injury', level: br, value: row.braden_score });
    const gcs = gcsCategory(row.gcs_score);
    if (gcs === 'severe_impairment' || gcs === 'moderate_impairment') flags.push({ type: 'neurological', level: gcs, value: row.gcs_score });
    if (row.pain_score !== null && row.pain_score !== undefined && row.pain_score >= 7) flags.push({ type: 'severe_pain', level: 'high', value: row.pain_score });
    return flags;
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'nursing-assessments',
        endpoints: [
            'GET /assessments',
            'GET /assessments/:id',
            'POST /assessments',
            'GET /assessments/patient/:patientId',
            'GET /high-risk-patients',
            'GET /assessments/:id/flags',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

router.get('/assessments', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, shift, assessment_type, from_date, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM nursing_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (shift) { sql += ` AND shift = $${params.length + 1}`; params.push(shift); }
        if (assessment_type) { sql += ` AND assessment_type = $${params.length + 1}`; params.push(assessment_type); }
        if (from_date) { sql += ` AND created_at >= $${params.length + 1}`; params.push(from_date); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/assessments/:id', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM nursing_assessments WHERE tenant_id = $1 AND id = $2`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'assessment_not_found' });
        const row = r.rows[0];
        res.json({
            ok: true,
            assessment: row,
            categories: {
                fall_risk: fallRiskCategory(row.fall_risk_score),
                braden: bradenCategory(row.braden_score),
                gcs: gcsCategory(row.gcs_score)
            },
            flags: compositeFlags(row)
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/assessments', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, patient_name, assessment_type, fall_risk_score, braden_score, pain_score, gcs_score, nurse, shift, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!assessment_type) return res.status(400).json({ ok: false, error: 'assessment_type_required' });
        if (!VALID_TYPES.includes(assessment_type)) return res.status(400).json({ ok: false, error: 'invalid_assessment_type', valid: VALID_TYPES });
        if (shift && !VALID_SHIFTS.includes(shift)) return res.status(400).json({ ok: false, error: 'invalid_shift', valid: VALID_SHIFTS });

        if (fall_risk_score !== undefined && fall_risk_score !== null && (fall_risk_score < 0 || fall_risk_score > 125)) return res.status(400).json({ ok: false, error: 'fall_risk_score_out_of_range' });
        if (braden_score !== undefined && braden_score !== null && (braden_score < 6 || braden_score > 23)) return res.status(400).json({ ok: false, error: 'braden_score_out_of_range' });
        if (pain_score !== undefined && pain_score !== null && (pain_score < 0 || pain_score > 10)) return res.status(400).json({ ok: false, error: 'pain_score_out_of_range' });
        if (gcs_score !== undefined && gcs_score !== null && (gcs_score < 3 || gcs_score > 15)) return res.status(400).json({ ok: false, error: 'gcs_score_out_of_range' });

        const r = await db.query(
            `INSERT INTO nursing_assessments (patient_id, patient_name, assessment_type, fall_risk_score, braden_score, pain_score, gcs_score, nurse, shift, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [patient_id, patient_name || null, assessment_type, fall_risk_score ?? null, braden_score ?? null, pain_score ?? null, gcs_score ?? null,
             nurse || req.user?.full_name || req.user?.id || null, shift || null, notes || null, req.tenantId]
        );
        const row = r.rows[0];
        res.status(201).json({
            ok: true,
            assessment: row,
            flags: compositeFlags(row),
            categories: {
                fall_risk: fallRiskCategory(row.fall_risk_score),
                braden: bradenCategory(row.braden_score),
                gcs: gcsCategory(row.gcs_score)
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/assessments/patient/:patientId', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT * FROM nursing_assessments WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 30`,
            [req.tenantId, req.params.patientId]
        );
        const enriched = r.rows.map(x => ({ ...x, flags: compositeFlags(x), braden_category: bradenCategory(x.braden_score), fall_risk_category: fallRiskCategory(x.fall_risk_score) }));
        res.json({ ok: true, count: enriched.length, latest: enriched[0] || null, history: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/high-risk-patients', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { hours = 24 } = req.query;
        const r = await db.query(
            `SELECT DISTINCT ON (patient_id) patient_id, patient_name, fall_risk_score, braden_score, gcs_score, pain_score, created_at
             FROM nursing_assessments
             WHERE tenant_id = $1 AND created_at >= NOW() - ($2 || ' hours')::INTERVAL
               AND (fall_risk_score >= 45 OR braden_score <= 13 OR gcs_score < 13 OR pain_score >= 7)
             ORDER BY patient_id, created_at DESC LIMIT 100`,
            [req.tenantId, hours]
        );
        const enriched = r.rows.map(x => ({
            ...x,
            flags: compositeFlags(x),
            braden_category: bradenCategory(x.braden_score),
            fall_risk_category: fallRiskCategory(x.fall_risk_score)
        }));
        res.json({ ok: true, hours: parseInt(hours), count: enriched.length, patients: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/assessments/:id/flags', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM nursing_assessments WHERE tenant_id = $1 AND id = $2`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'assessment_not_found' });
        const flags = compositeFlags(r.rows[0]);
        res.json({ ok: true, flags, has_critical: flags.some(f => f.level === 'high' || f.level === 'severe_impairment' || f.level === 'very_high') });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT COUNT(*) AS total, COUNT(DISTINCT patient_id) AS unique_patients, COUNT(DISTINCT nurse) AS nurses,
                    AVG(fall_risk_score)::NUMERIC(10,2) AS avg_fall_risk, AVG(braden_score)::NUMERIC(10,2) AS avg_braden,
                    AVG(pain_score)::NUMERIC(10,2) AS avg_pain, AVG(gcs_score)::NUMERIC(10,2) AS avg_gcs,
                    COUNT(*) FILTER (WHERE fall_risk_score >= 45) AS high_fall_risk,
                    COUNT(*) FILTER (WHERE braden_score <= 13) AS pressure_injury_risk,
                    COUNT(*) FILTER (WHERE gcs_score < 13) AS low_gcs
             FROM nursing_assessments WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        const shiftBreakdown = await db.query(
            `SELECT shift, COUNT(*) AS count FROM nursing_assessments WHERE tenant_id = $1 AND shift IS NOT NULL GROUP BY shift ORDER BY shift`,
            [req.tenantId]
        );
        res.json({ ok: true, summary_90d: r.rows[0], shift_breakdown: shiftBreakdown.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
