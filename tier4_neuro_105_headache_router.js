'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_neuro_105_headache_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-neuro-headache' }));
router.post('/migraine', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.migraineClassification(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/triptan', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.triptanChoice(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/cluster', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.clusterHeadache(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
