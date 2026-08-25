// filepath: namaweb/icu_ext_router.js
// ICU extension — ICP monitoring + ICU scoring (APACHE II/SOFA) + stroke admissions.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Intracranial pressure (neurocritical monitoring)
router.get('/icp/:patient_id', requireAuth, requireTenantScope, requireRole('intensivist', 'neurologist', 'doctor', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, log_time, icp_value, map_value, cpp_value, gcs_score, pupil_status, nurse_id, created_at
            FROM intracranial_pressure_logs WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY log_time DESC LIMIT 200
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, logs: r.rows });
    } catch (err) { console.error('GET /api/icux/icp', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/icp', requireAuth, requireTenantScope, requireRole('intensivist', 'neurologist', 'nurse'), async (req, res) => {
    try {
        const { patient_id, log_time, icp_value, map_value, cpp_value, gcs_score, pupil_status } = req.body;
        if (!patient_id || !log_time) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO intracranial_pressure_logs (tenant_id, patient_id, log_time, icp_value, map_value, cpp_value, gcs_score, pupil_status, nurse_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
        `, [req.tenantId, patient_id, log_time, icp_value || null, map_value || null, cpp_value || null, gcs_score || null, pupil_status || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/icux/icp', err); res.status(500).json({ error: 'internal_error' }); }
});

// ICU assessments (APACHE II + SOFA)
router.post('/score', requireAuth, requireTenantScope, requireRole('intensivist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, assessment_date, clinical_notes, apache_temp, apache_map, apache_hr, apache_rr, apache_pao2, apache_ph, apache_na, apache_k, apache_creatinine, apache_hct, apache_wbc, apache_gcs, sofa_pao2_fio2, sofa_platelets, sofa_bilirubin, sofa_map_vasopressor, sofa_gcs, sofa_creatinine } = req.body;
        if (!patient_id || !assessment_date) return res.status(400).json({ error: 'missing_required' });
        // Simple computation of APACHE II sub-scores (each on 0-4 scale)
        function tempAP(x) { if (x>=41||x<30) return 4; if (x>=39||x<32) return 3; if (x>=38.5||x<34) return 1; return 0; }
        function mapAP(x) { if (x>=160||x<50) return 4; if (x>=130||x<70) return 2; return 0; }
        function hrAP(x) { if (x>=180||x<40) return 4; if (x>=140||x<55) return 3; if (x<70) return 2; return 0; }
        function rrAP(x) { if (x>=50) return 4; if (x>=35||x<6) return 3; return 0; }
        function pao2AP(x) { if (x<55) return 4; return 0; }
        function phAP(x) { if (x>=7.7||x<7.15) return 4; if (x>=7.6||x<7.25) return 3; return 1; }
        function naAP(x) { if (x>=180||x<111) return 4; if (x>=160||x<120) return 2; return 0; }
        function kAP(x) { if (x>=7||x<2.5) return 4; return 0; }
        function crAP(x) { if (x>=3.5) return 4; if (x>=2) return 2; return 0; }
        function hctAP(x) { if (x>=60||x<20) return 4; if (x>=50||x<30) return 2; return 0; }
        function wbcAP(x) { if (x>=40||x<1) return 4; if (x>=20||x<3) return 2; return 0; }
        function gcsAP(x) { return Math.max(0, 15 - (x || 15)); }
        const apacheII = tempAP(+(apache_temp || 0)) + mapAP(+(apache_map || 0)) + hrAP(+(apache_hr || 0)) + rrAP(+(apache_rr || 0)) + pao2AP(+(apache_pao2 || 0)) + phAP(+(apache_ph || 0)) + naAP(+(apache_na || 0)) + kAP(+(apache_k || 0)) + crAP(+(apache_creatinine || 0)) + hctAP(+(apache_hct || 0)) + wbcAP(+(apache_wbc || 0)) + gcsAP(+(apache_gcs || 15));
        // SOFA sub-scores
        function pao2sof(x) { if (x<100) return 3; if (x<200) return 2; return 0; }
        function pltsof(x) { if (x<20) return 4; if (x<50) return 3; if (x<100) return 2; return 0; }
        function bilsof(x) { if (x>12) return 4; if (x>=6) return 3; return 0; }
        function mapsof(x) { if (x<70) return 4; if (x>=70) return 2; return 0; }
        function gcssof(x) { if (x<6) return 4; if (x<10) return 3; if (x<14) return 2; return 0; }
        function crsof(x) { if (x>5) return 4; if (x>=2) return 2; return 0; }
        const sofa = pao2sof(+(sofa_pao2_fio2 || 0)) + pltsof(+(sofa_platelets || 999)) + bilsof(+(sofa_bilirubin || 0)) + mapsof(+(sofa_map_vasopressor || 999)) + gcssof(+(sofa_gcs || 15)) + crsof(+(sofa_creatinine || 0));
        const r = await db.query(`
            INSERT INTO icu_assessments (tenant_id, patient_id, encounter_id, assessment_date, apache_temp, apache_map, apache_hr, apache_rr, apache_pao2, apache_ph, apache_na, apache_k, apache_creatinine, apache_hct, apache_wbc, apache_gcs, apache_ii_score, sofa_pao2_fio2, sofa_platelets, sofa_bilirubin, sofa_map_vasopressor, sofa_gcs, sofa_creatinine, sofa_score, clinical_notes, created_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
            RETURNING id, apache_ii_score, sofa_score
        `, [req.tenantId, patient_id, encounter_id || null, assessment_date, apache_temp || null, apache_map || null, apache_hr || null, apache_rr || null, apache_pao2 || null, apache_ph || null, apache_na || null, apache_k || null, apache_creatinine || null, apache_hct || null, apache_wbc || null, apache_gcs || null, apacheII, sofa_pao2_fio2 || null, sofa_platelets || null, sofa_bilirubin || null, sofa_map_vasopressor || null, sofa_gcs || null, sofa_creatinine || null, sofa, clinical_notes || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id, apache_ii_score: r.rows[0].apache_ii_score, sofa_score: r.rows[0].sofa_score });
    } catch (err) { console.error('POST /api/icux/score', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/score/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'intensivist'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, assessment_date, apache_ii_score, sofa_score, clinical_notes, created_at
            FROM icu_assessments WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY assessment_date DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/icux/score', err); res.status(500).json({ error: 'internal_error' }); }
});

// NICU
router.get('/nicu/:patient_id', requireAuth, requireTenantScope, requireRole('neonatologist', 'doctor', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, encounter_id, birth_weight_kg, apgar_1min, apgar_5min, gestational_age, nicu_los_days, created_at
            FROM neonatal_assessments WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY created_at DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, nicu: r.rows });
    } catch (err) { console.error('GET /api/icux/nicu', err); res.status(500).json({ error: 'internal_error' }); }
});

// Stroke unit (NIHSS + thrombectomy tracking)
router.get('/stroke/:patient_id', requireAuth, requireTenantScope, requireRole('neurologist', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, encounter_id, nihss, occlusion_site, tpa_given, thrombectomy, mrs_discharge, created_at
            FROM stroke_admissions WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY created_at DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, strokes: r.rows });
    } catch (err) { console.error('GET /api/icux/stroke', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'intensivist'), async (req, res) => {
    try {
        const ap = await db.query(`
            SELECT ROUND(AVG(APACHE_II_SCORE)::numeric, 1) as avg_apache,
                   ROUND(AVG(SOFA_SCORE)::numeric, 1) as avg_sofa,
                   COUNT(*) FILTER (WHERE APACHE_II_SCORE >= 25) as high_risk
            FROM icu_assessments WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
        `, [req.tenantId]);
        const icp = await db.query(`
            SELECT COUNT(*) FILTER (WHERE icp_value > 20) as elevated_icp_count,
                   COUNT(*) FILTER (WHERE log_time >= NOW() - INTERVAL '24 hours') as icp_readings_24h
            FROM intracranial_pressure_logs WHERE tenant_id = $1
        `, [req.tenantId]);
        const st = await db.query(`
            SELECT COUNT(*) FILTER (WHERE tpa_given = true) as tpa_given_count,
                   COUNT(*) FILTER (WHERE thrombectomy = true) as thrombectomy_count
            FROM stroke_admissions WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, assessments_30d: ap.rows[0], icp: icp.rows[0], strokes: st.rows[0] });
    } catch (err) { console.error('GET /api/icux/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['icp', 'score', 'nicu', 'stroke', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
