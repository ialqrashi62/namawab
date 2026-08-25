'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_obgyn_103_mfm_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-obgyn-mfm' }));
router.post('/iugr', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.iugrMonitoring(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/anomaly', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.fetalAnomalyWorkup(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
