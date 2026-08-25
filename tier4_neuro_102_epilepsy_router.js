'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_neuro_102_epilepsy_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-neuro-epilepsy' }));
router.post('/status', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.statusEpilepticus(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/drug', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.epilepsyDrugSelection(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
