'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_cardio_103_interventional_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-cardio-intervention' }));
router.post('/stemi', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.stemiPathway(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/lesion', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.pciLesionClassification(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/tavr', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.tavrDecision(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
