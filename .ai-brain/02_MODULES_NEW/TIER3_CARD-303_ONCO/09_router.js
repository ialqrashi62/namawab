'use strict';
/**
 * Cardio-Oncology — Express Router
 * Mount: /api/coo
 */
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier3_card_303_onco_engine');

const VALID_CANCER_TYPE = ['breast','lung','colorectal','lymphoma','leukemia','melanoma','ovarian','gastric','sarcoma','multiple_myeloma','other'];
const VALID_STAGE = ['I','II','III','IV'];
const VALID_THERAPY = ['anthracycline','trastuzumab','immunotherapy','tki','vegf_inhibitor','proteasome_inhibitor','alk_inhibitor','radiotherapy','car_t','transplant','none'];
const VALID_CTCAE = ['I','II','III','IV','V'];
const VALID_SEVERITY = ['low','moderate','high','very_high'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
  res.json({ ok: true, module: 'cardio-oncology', version: '1.0.0', timestamp: new Date().toISOString() });
});

// ===== Cases =====
router.get('/cases', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { cancer_type, status, limit = 100 } = req.query;
    const params = [req.tenantId];
    let sql = `SELECT * FROM cardio_onc_cases WHERE tenant_id = $1`;
    if (cancer_type) { sql += ` AND cancer_type = $${params.length + 1}`; params.push(cancer_type); }
    if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(parseInt(limit));
    const r = await db.query(sql, params);
    res.json({ ok: true, count: r.rows.length, rows: r.rows });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cases', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { patient_id, cancer_type, cancer_stage, cancer_diagnosis_date, cancer_therapy, hfa_icos_risk, baseline_ef_pct, baseline_gls_pct, comorbidity, status } = req.body;
    if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
    if (cancer_type && !VALID_CANCER_TYPE.includes(cancer_type)) return res.status(400).json({ ok: false, error: 'invalid_cancer_type', valid: VALID_CANCER_TYPE });
    if (cancer_stage && !VALID_STAGE.includes(cancer_stage)) return res.status(400).json({ ok: false, error: 'invalid_stage', valid: VALID_STAGE });
    if (cancer_therapy && !VALID_THERAPY.includes(cancer_therapy)) return res.status(400).json({ ok: false, error: 'invalid_therapy', valid: VALID_THERAPY });
    const r = await db.query(
      `INSERT INTO cardio_onc_cases (tenant_id, patient_id, cancer_type, cancer_stage, cancer_diagnosis_date, cancer_therapy, hfa_icos_risk, baseline_ef_pct, baseline_gls_pct, comorbidity, status, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [req.tenantId, patient_id, cancer_type || null, cancer_stage || null, cancer_diagnosis_date || null,
       cancer_therapy || null, hfa_icos_risk || null, baseline_ef_pct || null, baseline_gls_pct || null,
       comorbidity || null, status || 'active', req.user?.id || null]
    );
    res.status(201).json({ ok: true, case: r.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== Cardiotoxicity Events =====
router.post('/cardiotoxicity', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { case_id, patient_id, event_type, ctcae_grade, ef_pct, gls_pct, troponin, bnp, symptoms, treatment_initiated, cancer_therapy_modified, reversible } = req.body;
    if (!patient_id || !event_type) return res.status(400).json({ ok: false, error: 'patient_id_and_event_type_required' });
    if (ctcae_grade && !VALID_CTCAE.includes(ctcae_grade)) return res.status(400).json({ ok: false, error: 'invalid_ctcae_grade', valid: VALID_CTCAE });
    const r = await db.query(
      `INSERT INTO cardiotoxicity_events (tenant_id, case_id, patient_id, event_type, ctcae_grade, ef_pct, gls_pct, troponin, bnp, symptoms, treatment_initiated, cancer_therapy_modified, reversible)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [req.tenantId, case_id || null, patient_id, event_type, ctcae_grade || null,
       ef_pct || null, gls_pct || null, troponin || null, bnp || null, symptoms || null,
       treatment_initiated ? true : false, cancer_therapy_modified ? true : false, reversible ? true : false]
    );
    res.status(201).json({ ok: true, event: r.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ICI Myocarditis =====
router.post('/ici-myocarditis', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { case_id, patient_id, ici_type, symptom_onset_date, troponin, ef_pct, ecg_findings, mri_findings, treatment, severity, outcome } = req.body;
    if (!patient_id || !ici_type) return res.status(400).json({ ok: false, error: 'patient_id_and_ici_type_required' });
    const r = await db.query(
      `INSERT INTO ici_myocarditis (tenant_id, case_id, patient_id, ici_type, symptom_onset_date, troponin, ef_pct, ecg_findings, mri_findings, treatment, severity, outcome)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [req.tenantId, case_id || null, patient_id, ici_type, symptom_onset_date || null,
       troponin || null, ef_pct || null, ecg_findings || null, mri_findings || null,
       treatment || null, severity || null, outcome || null]
    );
    res.status(201).json({ ok: true, myocarditis: r.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== VTE in Cancer =====
router.post('/vte', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { patient_id, cancer_type, vte_type, location, diagnosis_date, treatment_drug, dose_mg, treatment_duration_months, recurrence, major_bleeding, on_chemo } = req.body;
    if (!patient_id || !vte_type) return res.status(400).json({ ok: false, error: 'patient_id_and_vte_type_required' });
    const r = await db.query(
      `INSERT INTO vte_cancer (tenant_id, patient_id, cancer_type, vte_type, location, diagnosis_date, treatment_drug, dose_mg, treatment_duration_months, recurrence, major_bleeding, on_chemo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [req.tenantId, patient_id, cancer_type || null, vte_type, location || null,
       diagnosis_date || null, treatment_drug || null, dose_mg || null,
       treatment_duration_months || null, recurrence ? true : false, major_bleeding ? true : false, on_chemo ? true : false]
    );
    res.status(201).json({ ok: true, vte: r.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== Scoring endpoints =====
router.post('/score/hfa-icos', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.hfaIcosRiskScore(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/ctcae', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.ctcaeCardiotoxicityGrade(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/gls', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.glsChangeDetection(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/ici-myocarditis', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.iciMyocarditis(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/dose/anthracycline', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.anthracyclineDose(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/trastuzumab', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.trastuzumabCardiotoxicityRisk(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/monitor/qtc', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.qtcMonitoring(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/decision/vte', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.vteTreatment(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/workup/amyloid', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.cardiacAmyloidWorkup(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/decision/cardioprotection', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.cardioprotectionDecision(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Stats =====
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
  try {
    const cases = await db.query(`SELECT cancer_type, hfa_icos_risk, COUNT(*) AS count FROM cardio_onc_cases WHERE tenant_id = $1 GROUP BY cancer_type, hfa_icos_risk`, [req.tenantId]);
    const events = await db.query(`SELECT ctcae_grade, COUNT(*) AS count FROM cardiotoxicity_events WHERE tenant_id = $1 GROUP BY ctcae_grade`, [req.tenantId]);
    const ici = await db.query(`SELECT severity, COUNT(*) AS count FROM ici_myocarditis WHERE tenant_id = $1 GROUP BY severity`, [req.tenantId]);
    res.json({ ok: true, cases: cases.rows, events: events.rows, ici_myocarditis: ici.rows });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
