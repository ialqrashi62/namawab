'use strict';
/**
 * PE/DVT Response Team — Express Router
 * Mount: /api/pedvt
 */
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier3_card_305_pe_dvt_engine');

const VALID_SEVERITY = ['massive','intermediate_high','intermediate_low','low'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
  res.json({ ok: true, module: 'pe-dvt-response', version: '1.0.0', timestamp: new Date().toISOString() });
});

router.get('/cases', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { severity, status, limit = 100 } = req.query;
    const params = [req.tenantId];
    let sql = `SELECT * FROM pe_dvt_cases WHERE tenant_id = $1`;
    if (severity) { sql += ` AND severity = $${params.length + 1}`; params.push(severity); }
    if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(parseInt(limit));
    const r = await db.query(sql, params);
    res.json({ ok: true, count: r.rows.length, rows: r.rows });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cases', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { patient_id, diagnosis, severity, location, sbp, hr, spo2, rv_dysfunction, biomarker_positive, pert_activated } = req.body;
    if (!patient_id || !diagnosis) return res.status(400).json({ ok: false, error: 'patient_id_and_diagnosis_required' });
    if (severity && !VALID_SEVERITY.includes(severity)) return res.status(400).json({ ok: false, error: 'invalid_severity', valid: VALID_SEVERITY });
    const r = await db.query(
      `INSERT INTO pe_dvt_cases (tenant_id, patient_id, diagnosis, severity, location, sbp, hr, spo2, rv_dysfunction, biomarker_positive, pert_activated, status, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'active',$12) RETURNING *`,
      [req.tenantId, patient_id, diagnosis, severity || null, location || null,
       sbp || null, hr || null, spo2 || null,
       rv_dysfunction ? true : false, biomarker_positive ? true : false, pert_activated ? true : false, req.user?.id || null]
    );
    res.status(201).json({ ok: true, case: r.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/treatments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { case_id, patient_id, treatment_type, drug_name, dose_mg, started_at, complications } = req.body;
    if (!patient_id || !treatment_type) return res.status(400).json({ ok: false, error: 'patient_id_and_treatment_required' });
    const r = await db.query(
      `INSERT INTO pe_dvt_treatments (tenant_id, case_id, patient_id, treatment_type, drug_name, dose_mg, started_at, complications)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [req.tenantId, case_id || null, patient_id, treatment_type, drug_name || null,
       dose_mg || null, started_at || null, complications || null]
    );
    res.status(201).json({ ok: true, treatment: r.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/score/spesi', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.sPesi(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/wells-dvt', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.wellsDvt(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/wells-pe', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.wellsPe(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/severity', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.peSeverity(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/thrombolysis', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.thrombolysisEligibility(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/cdt', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.catheterDirectedTherapy(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/thrombectomy', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.mechanicalThrombectomy(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/ivc-filter', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.ivcFilterDecision(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/anticoag', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.anticoagulationChoice(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/cteph', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.ctephWorkup(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/pert-activate', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.pertActivation(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/bleeding-risk', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.bleedingRiskAssessment(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
  try {
    const cases = await db.query(`SELECT severity, COUNT(*) AS count FROM pe_dvt_cases WHERE tenant_id = $1 GROUP BY severity`, [req.tenantId]);
    const treatments = await db.query(`SELECT treatment_type, COUNT(*) AS count FROM pe_dvt_treatments WHERE tenant_id = $1 GROUP BY treatment_type`, [req.tenantId]);
    res.json({ ok: true, cases: cases.rows, treatments: treatments.rows });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
