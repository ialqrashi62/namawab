// filepath: namaweb/labs_special_router.js
// Specialty labs — hepatic markers (Child-Pugh score) + diabetes glucose lab values.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Hepatic markers — auto-compute Child-Pugh score
router.get('/hepatic/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, encounter_id, bilirubin_total, bilirubin_direct, alt_level, ast_level, alk_phos,
                   albumin, child_pugh_score, created_at
            FROM gastro_hepatic_markers WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY created_at DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, hepatic: r.rows });
    } catch (err) { console.error('GET /api/labsz/hepatic', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/hepatic', requireAuth, requireTenantScope, requireRole('doctor', 'lab'), async (req, res) => {
    try {
        const { patient_id, encounter_id, bilirubin_total, bilirubin_direct, alt_level, ast_level, alk_phos, albumin } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required' });

        // Compute Child-Pugh score
        // Bilirubin: <2=1, 2-3=2, >3=3
        // Albumin: >3.5=1, 2.8-3.5=2, <2.8=3
        // (INR/encephalopathy/ascites omitted — use clinical inputs only)
        let bili_pts = 1;
        if (bilirubin_total >= 2 && bilirubin_total <= 3) bili_pts = 2;
        else if (bilirubin_total > 3) bili_pts = 3;

        let alb_pts = 1;
        if (albumin >= 2.8 && albumin < 3.5) alb_pts = 2;
        else if (albumin < 2.8) alb_pts = 3;

        const child_pugh = bili_pts + alb_pts; // partial (3 of 5 clinical criteria)
        const r = await db.query(`
            INSERT INTO gastro_hepatic_markers (tenant_id, patient_id, encounter_id, bilirubin_total, bilirubin_direct, alt_level, ast_level, alk_phos, albumin, child_pugh_score)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id, child_pugh_score
        `, [req.tenantId, patient_id, encounter_id || null, bilirubin_total || null, bilirubin_direct || null, alt_level || null, ast_level || null, alk_phos || null, albumin || null, child_pugh]);
        res.status(201).json({ ok: true, id: r.rows[0].id, child_pugh_score: r.rows[0].child_pugh_score });
    } catch (err) { console.error('POST /api/labsz/hepatic', err); res.status(500).json({ error: 'internal_error' }); }
});

// Glucose lab values (continuous vs fingersticks)
router.get('/glucose-lab/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, doctor_id, glucose_value, log_type, notes, created_at
            FROM diabetes_glucose_logs WHERE tenant_id = $1 AND patient_id = $2
              AND log_type IN ('lab','fasting','postprandial')
            ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, values: r.rows });
    } catch (err) { console.error('GET /api/labsz/glucose-lab', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/glucose-lab', requireAuth, requireTenantScope, requireRole('doctor', 'lab'), async (req, res) => {
    try {
        const { patient_id, doctor_id, glucose_value, log_type, notes } = req.body;
        if (!patient_id || glucose_value == null) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO diabetes_glucose_logs (tenant_id, patient_id, doctor_id, glucose_value, log_type, notes)
            VALUES ($1, $2, $3, $4, COALESCE($5, 'lab'), $6) RETURNING id
        `, [req.tenantId, patient_id, doctor_id || req.userId, glucose_value, log_type, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/labsz/glucose-lab', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const h = await db.query(`
            SELECT ROUND(AVG(child_pugh_score)::numeric, 2) as avg_child_pugh,
                   COUNT(*) FILTER (WHERE child_pugh_score >= 5) as severe_liver_disease,
                   COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as hepatic_30d
            FROM gastro_hepatic_markers WHERE tenant_id = $1
        `, [req.tenantId]);
        const g = await db.query(`
            SELECT COUNT(*) FILTER (WHERE log_type = 'lab') as lab_values_30d,
                   COUNT(*) FILTER (WHERE glucose_value > 180) as hyperglycemic_readings,
                   COUNT(*) FILTER (WHERE glucose_value < 70) as hypoglycemic_readings
            FROM diabetes_glucose_logs WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
        `, [req.tenantId]);
        res.json({ ok: true, hepatic: h.rows[0], glucose_30d: g.rows[0] });
    } catch (err) { console.error('GET /api/labsz/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['hepatic', 'glucose-lab', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
