'use strict';
/**
 * Advanced Heart Failure — Express Router
 * Mount: /api/ahf
 */
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier3_card_302_ahf_engine');

const VALID_NYHA = [1, 2, 3, 4];
const VALID_STAGE = ['A', 'B', 'C', 'D'];
const VALID_INTERMACS = [1, 2, 3, 4, 5, 6, 7];
const VALID_SCAI = ['A', 'B', 'C', 'D', 'E'];
const VALID_TRANSPLANT_STATUS = ['1A', '1B', '2', '7', 'inactive'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
  res.json({ ok: true, module: 'advanced-heart-failure', version: '1.0.0', timestamp: new Date().toISOString() });
});

// ===== Pages =====
router.get('/cases', requireAuth, requireTenantScope, async (req, res) => {
  try {
    const { status, limit = 100 } = req.query;
    const params = [req.tenantId];
    let sql = `SELECT * FROM hf_cases WHERE tenant_id = $1`;
    if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(parseInt(limit));
    const r = await db.query(sql, params);
    res.json({ ok: true, count: r.rows.length, rows: r.rows });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cases', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { patient_id, ef_pct, nyha_class, acc_stage, nt_probnp, comorbidities, gdmt_score, status, assigned_cardiologist } = req.body;
    if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
    if (nyha_class && !VALID_NYHA.includes(parseInt(nyha_class))) return res.status(400).json({ ok: false, error: 'invalid_nyha', valid: VALID_NYHA });
    if (acc_stage && !VALID_STAGE.includes(acc_stage)) return res.status(400).json({ ok: false, error: 'invalid_acc_stage', valid: VALID_STAGE });
    const r = await db.query(
      `INSERT INTO hf_cases (tenant_id, patient_id, ef_pct, nyha_class, acc_stage, nt_probnp, comorbidities, gdmt_score, status, assigned_cardiologist, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [req.tenantId, patient_id, ef_pct || null, nyha_class || null, acc_stage || null, nt_probnp || null,
       comorbidities || null, gdmt_score || null, status || 'active', assigned_cardiologist || null, req.user?.id || null]
    );
    res.status(201).json({ ok: true, case: r.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== Diuretic Admissions =====
router.post('/admissions', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { patient_id, hf_case_id, admitted_at, weight_kg, iv_diuretic, dose_mg, urine_output_ml_24h, discharge_weight, discharge_date, hospital_days, mortality_30d, mortality_1yr } = req.body;
    if (!patient_id || !weight_kg) return res.status(400).json({ ok: false, error: 'patient_id_and_weight_required' });
    const r = await db.query(
      `INSERT INTO hf_admissions (tenant_id, hf_case_id, patient_id, admitted_at, weight_kg, iv_diuretic, dose_mg, urine_output_ml_24h, discharge_weight, discharge_date, hospital_days, mortality_30d, mortality_1yr)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [req.tenantId, hf_case_id || null, patient_id, admitted_at || null, weight_kg,
       iv_diuretic || null, dose_mg || null, urine_output_ml_24h || null, discharge_weight || null,
       discharge_date || null, hospital_days || null, mortality_30d ? true : false, mortality_1yr ? true : false]
    );
    res.status(201).json({ ok: true, admission: r.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== LVAD Patients =====
router.post('/lvad', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { patient_id, hf_case_id, device, implant_date, indication, current_speed, current_power, current_flow, map_target, inr_target, complications } = req.body;
    if (!patient_id || !device) return res.status(400).json({ ok: false, error: 'patient_id_and_device_required' });
    const r = await db.query(
      `INSERT INTO lvad_patients (tenant_id, hf_case_id, patient_id, device, implant_date, indication, current_speed, current_power, current_flow, map_target, inr_target, complications)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [req.tenantId, hf_case_id || null, patient_id, device, implant_date || null, indication || null,
       current_speed || null, current_power || null, current_flow || null, map_target || null, inr_target || null,
       complications || null]
    );
    res.status(201).json({ ok: true, lvad: r.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== Heart Transplant =====
router.post('/transplant', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { patient_id, hf_case_id, transplant_date, donor_id, donor_age, donor_cause, ischaemia_time_min, immunosuppression_protocol, induction_therapy, first_biopsy_date, rejection_episode_grade, cav_status, status } = req.body;
    if (!patient_id || !transplant_date) return res.status(400).json({ ok: false, error: 'patient_id_and_date_required' });
    const r = await db.query(
      `INSERT INTO heart_transplants (tenant_id, hf_case_id, patient_id, transplant_date, donor_id, donor_age, donor_cause, ischaemia_time_min, immunosuppression_protocol, induction_therapy, first_biopsy_date, rejection_episode_grade, cav_status, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [req.tenantId, hf_case_id || null, patient_id, transplant_date, donor_id || null, donor_age || null,
       donor_cause || null, ischaemia_time_min || null, immunosuppression_protocol || null, induction_therapy || null,
       first_biopsy_date || null, rejection_episode_grade || null, cav_status || null, status || 'active']
    );
    res.status(201).json({ ok: true, transplant: r.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== Scoring endpoints =====
router.post('/score/nyha', requireAuth, requireTenantScope, (req, res) => {
  try { res.json({ ok: true, result: engine.nyhaClass(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/acc-stage', requireAuth, requireTenantScope, (req, res) => {
  try { res.json({ ok: true, result: engine.accStage(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/lvef', requireAuth, requireTenantScope, (req, res) => {
  try { res.json({ ok: true, result: engine.lvefClassification(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/ntprobnp', requireAuth, requireTenantScope, (req, res) => {
  try { res.json({ ok: true, result: engine.ntprobnpInterpret(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/maggic', requireAuth, requireTenantScope, (req, res) => {
  try { res.json({ ok: true, result: engine.maggicScore(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/intermacs', requireAuth, requireTenantScope, (req, res) => {
  try { res.json({ ok: true, result: engine.intermacsProfile(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/scai-shock', requireAuth, requireTenantScope, (req, res) => {
  try { res.json({ ok: true, result: engine.scaiShockStage(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/gdmt/eligibility', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.gdmtEligibility(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/dose/arni', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.arniDosing(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/dose/sglt2i', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.sglt2iDosing(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/lvad/checklist', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.lvadPreOpChecklist(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/transplant/listing', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.transplantListingStatus(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/lvad/thrombosis-risk', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.lvadPumpThrombosisRisk(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/heartmate3', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.heartMate3Risk(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/dose/diuretic', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.diureticDose(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/palliative/trigger', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.palliativeCareTrigger(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Stats =====
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
  try {
    const cases = await db.query(`SELECT acc_stage, COUNT(*) AS count FROM hf_cases WHERE tenant_id = $1 GROUP BY acc_stage`, [req.tenantId]);
    const lvad = await db.query(`SELECT device, COUNT(*) AS count FROM lvad_patients WHERE tenant_id = $1 GROUP BY device`, [req.tenantId]);
    const tx = await db.query(`SELECT status, COUNT(*) AS count FROM heart_transplants WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
    const mortality = await db.query(`SELECT COUNT(*) FILTER (WHERE mortality_30d) AS m30, COUNT(*) AS total FROM hf_admissions WHERE tenant_id = $1 AND admitted_at >= NOW() - INTERVAL '90 days'`, [req.tenantId]);
    res.json({ ok: true, cases: cases.rows, lvad: lvad.rows, transplants: tx.rows, mortality_30d: mortality.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
