'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./p0_6_erx_engine');

router.get('/health', (req, res) => res.json({ ok: true, module: 'e-prescription', version: '1.0.0', timestamp: new Date().toISOString() }));

router.post('/controlled-check', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.controlledSubstanceCheck(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/generate', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.eRxGeneration(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/refill-validate', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.refillValidation(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/dosage-validate', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.dosageValidation(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/cancel', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.prescriptionCancellation(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/prior-auth', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.priorAuthorization(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/sign', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.electronicSignature(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

module.exports = router;
