'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_ent_103_laryngology_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-ent-laryngology' }));
router.post('/dysphagia', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.dysphagiaEvaluation(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/vocal-cord', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.vocalCordParalysis(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/globus', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.globusPharyngeus(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
