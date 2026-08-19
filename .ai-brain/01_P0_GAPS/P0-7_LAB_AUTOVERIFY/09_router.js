'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./p0_7_lab_engine');

router.get('/health', (req, res) => res.json({ ok: true, module: 'lab-autoverify', timestamp: new Date().toISOString() }));

router.post('/autoverify', requireAuth, requireTenantScope, requireRole('lab'), (req, res) => {
  try { res.json({ ok: true, result: engine.autoverifyRules(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/critical-alert', requireAuth, requireTenantScope, requireRole('lab'), (req, res) => {
  try { res.json({ ok: true, result: engine.criticalValueAlert(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/delta-check', requireAuth, requireTenantScope, requireRole('lab'), (req, res) => {
  try { res.json({ ok: true, result: engine.deltaCheck(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/reflex', requireAuth, requireTenantScope, requireRole('lab'), (req, res) => {
  try { res.json({ ok: true, result: engine.reflexTesting(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/qc', requireAuth, requireTenantScope, requireRole('lab'), (req, res) => {
  try { res.json({ ok: true, result: engine.qcStatusCheck(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

module.exports = router;