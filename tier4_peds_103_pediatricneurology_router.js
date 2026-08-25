'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_peds_103_pediatricneurology_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-peds-pneuro' }));
router.post('/febrile-seizure', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.febrileSeizureClassification(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/epilepsy', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.pediatricEpilepsySyndrome(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/headache-redflags', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.pediatricHeadacheRedFlags(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
