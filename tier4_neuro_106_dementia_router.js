'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_neuro_106_dementia_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-neuro-dementia' }));
router.post('/workup', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.dementiaWorkup(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/medication', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.dementiaMedication(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
