'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_obgyn_105_rei_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-obgyn-rei' }));
router.post('/infertility', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.infertilityWorkup(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/pcos', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.pcosManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/ivf', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.ivfCyclePlan(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
