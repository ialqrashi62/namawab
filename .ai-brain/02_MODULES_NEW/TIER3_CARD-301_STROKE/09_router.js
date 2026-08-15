'use strict';
/**
 * Stroke Center — Express Router
 * Mount: /api/stroke
 */
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier3_card_301_stroke_engine');

const VALID_CT_FINDINGS = ['no_acute_hemorrhage','ischemic_changes','hemorrhage','mass_effect','hyperdense_mca','early_ischemic_changes'];
const VALID_ANTIPLATELET = ['aspirin','clopidogrel','aspirin+clopidogrel','ticagrelor','none'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
  res.json({ ok: true, module: 'stroke-center', version: '1.0.0', timestamp: new Date().toISOString() });
});

// ===== Stroke Cases =====
router.get('/cases', requireAuth, requireTenantScope, async (req, res) => {
  try {
    const { status, type, limit = 100 } = req.query;
    const params = [req.tenantId];
    let sql = `SELECT * FROM stroke_cases WHERE tenant_id = $1`;
    if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
    if (type) { sql += ` AND stroke_type = $${params.length + 1}`; params.push(type); }
    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(parseInt(limit));
    const r = await db.query(sql, params);
    res.json({ ok: true, count: r.rows.length, rows: r.rows });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cases', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { patient_id, encounter_id, stroke_type, arrival_time, last_known_well, nihss_score, ct_findings, aspects_score, code_stroke_activated, admitted_to_stroke_unit, status, assigned_neurologist } = req.body;
    if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
    if (ct_findings && !VALID_CT_FINDINGS.includes(ct_findings)) return res.status(400).json({ ok: false, error: 'invalid_ct_findings', valid: VALID_CT_FINDINGS });
    const r = await db.query(
      `INSERT INTO stroke_cases (tenant_id, patient_id, encounter_id, stroke_type, arrival_time, last_known_well, nihss_score, ct_findings, aspects_score, code_stroke_activated, admitted_to_stroke_unit, status, assigned_neurologist, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [req.tenantId, patient_id, encounter_id || null, stroke_type || null, arrival_time || null,
       last_known_well || null, nihss_score || null, ct_findings || null, aspects_score || null,
       code_stroke_activated ? true : false, admitted_to_stroke_unit ? true : false,
       status || 'active', assigned_neurologist || null, req.user?.id || null]
    );
    res.status(201).json({ ok: true, case: r.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== Thrombolysis Treatments =====
router.post('/thrombolysis', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { stroke_case_id, patient_id, agent, dose_mg, weight_kg, administered_at, door_to_needle_minutes, nihss_before, nihss_after_24h, complications, consent_obtained, consent_witness, ordering_physician } = req.body;
    if (!patient_id || !agent || !dose_mg) return res.status(400).json({ ok: false, error: 'patient_id_agent_dose_required' });
    const r = await db.query(
      `INSERT INTO stroke_thrombolysis (tenant_id, stroke_case_id, patient_id, agent, dose_mg, weight_kg, administered_at, door_to_needle_minutes, nihss_before, nihss_after_24h, complications, consent_obtained, consent_witness, ordering_physician)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [req.tenantId, stroke_case_id || null, patient_id, agent, dose_mg, weight_kg || null,
       administered_at || new Date().toISOString(), door_to_needle_minutes || null,
       nihss_before || null, nihss_after_24h || null, complications || null,
       consent_obtained ? true : false, consent_witness || null, ordering_physician || null]
    );
    res.status(201).json({ ok: true, thrombolysis: r.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/thrombolysis', requireAuth, requireTenantScope, async (req, res) => {
  try {
    const { patient_id, days = 90, limit = 100 } = req.query;
    const params = [req.tenantId];
    let sql = `SELECT * FROM stroke_thrombolysis WHERE tenant_id = $1 AND administered_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
    if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
    sql += ` ORDER BY administered_at DESC LIMIT $${params.length + 1}`;
    params.push(parseInt(limit));
    const r = await db.query(sql, params);
    res.json({ ok: true, count: r.rows.length, rows: r.rows });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== Thrombectomy =====
router.post('/thrombectomy', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { stroke_case_id, patient_id, procedure_time, door_to_groin_minutes, tici_score, groin_puncture_time, reperfusion_time, mrs_24h, mrs_7d, mrs_30d, complications, operator } = req.body;
    if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
    const r = await db.query(
      `INSERT INTO stroke_thrombectomy (tenant_id, stroke_case_id, patient_id, procedure_time, door_to_groin_minutes, tici_score, groin_puncture_time, reperfusion_time, mrs_24h, mrs_7d, mrs_30d, complications, operator)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [req.tenantId, stroke_case_id || null, patient_id, procedure_time || null,
       door_to_groin_minutes || null, tici_score || null, groin_puncture_time || null,
       reperfusion_time || null, mrs_24h || null, mrs_7d || null, mrs_30d || null,
       complications || null, operator || null]
    );
    res.status(201).json({ ok: true, thrombectomy: r.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== Stroke Imaging =====
router.post('/imaging', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { stroke_case_id, patient_id, imaging_type, performed_at, findings, aspects_score, occlusion_site, perfusion_findings, radiologist } = req.body;
    if (!patient_id || !imaging_type) return res.status(400).json({ ok: false, error: 'patient_id_imaging_type_required' });
    const r = await db.query(
      `INSERT INTO stroke_imaging (tenant_id, stroke_case_id, patient_id, imaging_type, performed_at, findings, aspects_score, occlusion_site, perfusion_findings, radiologist)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [req.tenantId, stroke_case_id || null, patient_id, imaging_type, performed_at || null,
       findings || null, aspects_score || null, occlusion_site || null, perfusion_findings || null, radiologist || null]
    );
    res.status(201).json({ ok: true, imaging: r.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== Scoring utilities =====
router.post('/score/nihss', requireAuth, requireTenantScope, (req, res) => {
  try { res.json({ ok: true, result: engine.nihssScore(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/aspects', requireAuth, requireTenantScope, (req, res) => {
  try { res.json({ ok: true, result: engine.aspectsScore(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/mrs', requireAuth, requireTenantScope, (req, res) => {
  try { res.json({ ok: true, result: engine.mrsScore(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/ich', requireAuth, requireTenantScope, (req, res) => {
  try { res.json({ ok: true, result: engine.ichScore(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/hunt-hess', requireAuth, requireTenantScope, (req, res) => {
  try { res.json({ ok: true, result: engine.huntHess(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/abcd2', requireAuth, requireTenantScope, (req, res) => {
  try { res.json({ ok: true, result: engine.abcd2Score(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/cha2ds2vasc', requireAuth, requireTenantScope, (req, res) => {
  try { res.json({ ok: true, result: engine.cha2ds2vascScore(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/has-bled', requireAuth, requireTenantScope, (req, res) => {
  try { res.json({ ok: true, result: engine.hasBledScore(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/dose/tenecteplase', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.tenecteplaseDose(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/eligibility/thrombolysis', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.thrombolysisEligibility(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/compliance/door-to-needle', requireAuth, requireTenantScope, (req, res) => {
  try { res.json({ ok: true, result: engine.doorToNeedleCompliance(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/bundle/secondary-prevention', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.secondaryPreventionBundle(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Stats =====
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
  try {
    const cases = await db.query(`SELECT stroke_type, COUNT(*) AS count FROM stroke_cases WHERE tenant_id = $1 GROUP BY stroke_type`, [req.tenantId]);
    const ttt = await db.query(`SELECT COUNT(*) FILTER (WHERE door_to_needle_minutes <= 60) AS compliant, COUNT(*) AS total FROM stroke_thrombolysis WHERE tenant_id = $1 AND administered_at >= NOW() - INTERVAL '90 days'`, [req.tenantId]);
    const mrs = await db.query(`SELECT mrs_30d, COUNT(*) AS count FROM stroke_thrombectomy WHERE tenant_id = $1 AND mrs_30d IS NOT NULL GROUP BY mrs_30d`, [req.tenantId]);
    res.json({ ok: true, cases: cases.rows, dnt_compliance: ttt.rows[0], mrs_30d: mrs.rows });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
