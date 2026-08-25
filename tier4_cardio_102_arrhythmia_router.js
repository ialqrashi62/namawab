'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_cardio_102_arrhythmia_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-cardio-ep' }));
router.post('/af-stroke', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.afStrokeRisk(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/af-rhythm', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.afRhythmControl(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/ablation', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.ablationDecision(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/pacing', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.bradyPacing(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/icd', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.icdPrimary(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
