'use strict';
/**
 * BCMA — Express Router
 * Mount: /api/bcma
 */
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./p0_3_bcma_engine');

router.get('/health', (req, res) => res.json({ ok: true, module: 'bcma', version: '1.0.0', timestamp: new Date().toISOString() }));

// ===== 5 Rights Verification =====
router.post('/verify-5-rights', requireAuth, requireTenantScope, requireRole('nurse'), (req, res) => {
  try { res.json({ ok: true, result: engine.verifyFiveRights(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Allergy Check =====
router.post('/allergy-check', requireAuth, requireTenantScope, requireRole('nurse'), (req, res) => {
  try { res.json({ ok: true, result: engine.allergyCheck(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Drug Interaction =====
router.post('/interaction-check', requireAuth, requireTenantScope, requireRole('nurse'), (req, res) => {
  try { res.json({ ok: true, result: engine.drugInteractionCheck(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== High-Alert Double Check =====
router.post('/high-alert-check', requireAuth, requireTenantScope, requireRole('nurse'), (req, res) => {
  try { res.json({ ok: true, result: engine.highAlertDoubleCheck(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Override Workflow =====
router.post('/override', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
  try {
    const r = engine.overrideWorkflow(req.body);
    if (r.valid) {
      await db.query(`INSERT INTO bcma_overrides (tenant_id, patient_id, drug, reason, witness_nurse_id, provider_approval, administered_by, created_by)
                      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [req.tenantId, req.body.patient_id, req.body.drug, req.body.reason,
         req.body.witness_nurse_id, req.body.provider_approval, req.user?.id || null, req.user?.id || null]);
    }
    res.json({ ok: true, ...r });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== PRN Tracking =====
router.post('/prn-track', requireAuth, requireTenantScope, requireRole('nurse'), (req, res) => {
  try { res.json({ ok: true, result: engine.prnTracking(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Insulin Double Check =====
router.post('/insulin-double-check', requireAuth, requireTenantScope, requireRole('nurse'), (req, res) => {
  try { res.json({ ok: true, result: engine.insulinDoubleCheck(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Chemo Verification =====
router.post('/chemo-verify', requireAuth, requireTenantScope, requireRole('nurse'), (req, res) => {
  try { res.json({ ok: true, result: engine.chemoVerification(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Disposal Tracking =====
router.post('/disposal', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
  try {
    const r = engine.disposalTracking(req.body);
    if (r.documented) {
      await db.query(`INSERT INTO bcma_disposals (tenant_id, drug, amount_disposed, witness_nurse_id, reason, administered_by)
                      VALUES ($1, $2, $3, $4, $5, $6)`,
        [req.tenantId, req.body.drug, req.body.amount_disposed, req.body.witness_nurse_id,
         req.body.reason, req.user?.id || null]);
    }
    res.json({ ok: true, ...r });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Late Dose =====
router.post('/late-dose', requireAuth, requireTenantScope, requireRole('nurse'), (req, res) => {
  try { res.json({ ok: true, result: engine.lateDoseDetection(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== MAR Entry =====
router.post('/mar', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
  try {
    const r = await db.query(
      `INSERT INTO bcma_mar_entries (tenant_id, patient_id, drug, dose, route, scheduled_time, administered_time, administered_by, verified_by, allergies_checked, interactions_checked, double_check_required, status)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, $9, $10, $11, 'administered') RETURNING *`,
      [req.tenantId, req.body.patient_id, req.body.drug, req.body.dose, req.body.route,
       req.body.scheduled_time, req.user?.id || null, req.body.verified_by || null,
       req.body.allergies_checked ? true : false, req.body.interactions_checked ? true : false,
       req.body.double_check_required ? true : false]);
    res.status(201).json({ ok: true, entry: r.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== Stats =====
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
  try {
    const r = await db.query(`SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE double_check_required) AS double_checks FROM bcma_mar_entries WHERE tenant_id = $1`, [req.tenantId]);
    res.json({ ok: true, ...r.rows[0] });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
