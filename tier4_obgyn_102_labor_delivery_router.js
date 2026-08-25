'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_obgyn_102_labor_delivery_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-obgyn-ld' }));
router.post('/friedman', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.friedmanCurve(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/fetal-monitor', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.fetalMonitoring(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/induction', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.induction(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
