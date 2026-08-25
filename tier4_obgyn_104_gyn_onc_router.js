'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_obgyn_104_gyn_onc_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-obgyn-gynonc' }));
router.post('/ovarian-risk', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.ovarianCancerRisk(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/endometrial', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.endometrialCancerWorkup(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/cervical-screen', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.cervicalCancerScreen(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
