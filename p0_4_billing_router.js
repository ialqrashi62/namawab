'use strict';
/**
 * P0-4 Advanced Billing Router
 * Mount: /api/bill
 */
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./p0_4_billing_engine');

router.get('/health', (req, res) => res.json({ ok: true, module: 'advanced-billing', version: '1.0.0', timestamp: new Date().toISOString() }));

router.post('/nphies/claim', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  try { res.json({ ok: true, result: engine.nphiesClaim(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});
router.post('/zatca/invoice', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  try { res.json({ ok: true, result: engine.zatcaInvoice(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});
router.post('/sfda/map', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  try { res.json({ ok: true, result: engine.sfdaDrugCodeMapping(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});
router.post('/insurance/preauth', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  try { res.json({ ok: true, result: engine.insurancePreAuth(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});
router.post('/vat', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  try { res.json({ ok: true, result: engine.vatCalculation(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});
router.post('/denial/appeal', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  try { res.json({ ok: true, result: engine.deniedClaimsReconsideration(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});
router.post('/reconcile', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  try { res.json({ ok: true, result: engine.paymentReconciliation(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});
router.post('/bundle', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  try { res.json({ ok: true, result: engine.nphiesBundle(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});
router.post('/estimate', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  try { res.json({ ok: true, result: engine.selfPayEstimate(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});
router.post('/refund', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  try { res.json({ ok: true, result: engine.refundProcessing(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

module.exports = router;