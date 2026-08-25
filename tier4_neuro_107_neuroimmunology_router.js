'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_neuro_107_neuroimmunology_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-neuro-immuno' }));
router.post('/nmo', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.nmoDiagnosis(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/nmo-therapy', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.nmoTherapy(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/ae', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.autoimmuneEncephalitis(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
