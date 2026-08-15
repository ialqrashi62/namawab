'use strict';
/**
 * Robotic CV Surgery — Express Router
 * Mount: /api/rcv
 */
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier3_card_304_robotic_engine');

const VALID_PROCEDURE = ['robotic_mitral_repair','robotic_mitral_replace','robotic_cabg','robotic_asd','robotic_myxoma','robotic_tricuspid','robotic_maze','tavi','mitraclip','watchman','tevar','evar'];
const VALID_DEVICE = ['davinci_xi','davinci_sp','sapien_3','evolut','mitraclip_g4','watchman_flx','sentinel'];
const VALID_RISK = ['low','moderate','high','very_high'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
  res.json({ ok: true, module: 'robotic-cv-surgery', version: '1.0.0', timestamp: new Date().toISOString() });
});

router.get('/cases', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { status, procedure, limit = 100 } = req.query;
    const params = [req.tenantId];
    let sql = `SELECT * FROM robotic_cv_cases WHERE tenant_id = $1`;
    if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
    if (procedure) { sql += ` AND procedure_type = $${params.length + 1}`; params.push(procedure); }
    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(parseInt(limit));
    const r = await db.query(sql, params);
    res.json({ ok: true, count: r.rows.length, rows: r.rows });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cases', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { patient_id, diagnosis, procedure_type, device, sts_score, euroscore_ii, ef_pct, status } = req.body;
    if (!patient_id || !procedure_type) return res.status(400).json({ ok: false, error: 'patient_id_and_procedure_required' });
    if (!VALID_PROCEDURE.includes(procedure_type)) return res.status(400).json({ ok: false, error: 'invalid_procedure', valid: VALID_PROCEDURE });
    if (device && !VALID_DEVICE.includes(device)) return res.status(400).json({ ok: false, error: 'invalid_device', valid: VALID_DEVICE });
    const r = await db.query(
      `INSERT INTO robotic_cv_cases (tenant_id, patient_id, diagnosis, procedure_type, device, sts_score, euroscore_ii, ef_pct, status, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [req.tenantId, patient_id, diagnosis || null, procedure_type, device || null,
       sts_score || null, euroscore_ii || null, ef_pct || null, status || 'pending', req.user?.id || null]
    );
    res.status(201).json({ ok: true, case: r.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/procedures', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { case_id, patient_id, procedure_date, console_hours, bypass_time_min, cross_clamp_min, conversion_to_open, success, complications } = req.body;
    if (!patient_id || !procedure_date) return res.status(400).json({ ok: false, error: 'patient_id_and_date_required' });
    const r = await db.query(
      `INSERT INTO robotic_cv_procedures (tenant_id, case_id, patient_id, procedure_date, console_hours, bypass_time_min, cross_clamp_min, conversion_to_open, success, complications)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [req.tenantId, case_id || null, patient_id, procedure_date, console_hours || null,
       bypass_time_min || null, cross_clamp_min || null, conversion_to_open ? true : false, success ? true : false, complications || null]
    );
    res.status(201).json({ ok: true, procedure: r.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/followups', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const { case_id, patient_id, followup_date, followup_type, echo_findings, valve_function, complications, notes } = req.body;
    if (!patient_id || !followup_date) return res.status(400).json({ ok: false, error: 'patient_id_and_date_required' });
    const r = await db.query(
      `INSERT INTO robotic_cv_followups (tenant_id, case_id, patient_id, followup_date, followup_type, echo_findings, valve_function, complications, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [req.tenantId, case_id || null, patient_id, followup_date, followup_type || 'routine',
       echo_findings || null, valve_function || null, complications || null, notes || null]
    );
    res.status(201).json({ ok: true, followup: r.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/score/sts', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.stsScore(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/score/euroscore', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.euroscoreII(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/eligibility/tavi', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.taviEligibility(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/eligibility/mitraclip', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.mitraclipEligibility(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/eligibility/watchman', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.watchmanEligibility(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/eligibility/robotic', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.roboticSurgeryEligibility(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/checklist/preop', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.preOpChecklist(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/risk/conversion', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.conversionToOpenRisk(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/risk/postop', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.postOpComplicationRisk(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/discharge/readiness', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.dischargeReadiness(req.body) }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
  try {
    const cases = await db.query(`SELECT procedure_type, COUNT(*) AS count FROM robotic_cv_cases WHERE tenant_id = $1 GROUP BY procedure_type`, [req.tenantId]);
    const procs = await db.query(`SELECT conversion_to_open, COUNT(*) AS count FROM robotic_cv_procedures WHERE tenant_id = $1 GROUP BY conversion_to_open`, [req.tenantId]);
    res.json({ ok: true, cases: cases.rows, procedures: procs.rows });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
