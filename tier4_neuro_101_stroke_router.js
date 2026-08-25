'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_neuro_101_stroke_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-neuro-stroke' }));
router.post('/triage', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.acuteStrokeTriage(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/etiology', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.strokeEtiology(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/ich', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.intracerebralHemorrhage(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/tia', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.tiaWorkup(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
