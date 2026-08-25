'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_neuro_104_movement_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-neuro-movement' }));
router.post('/pd', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.parkinsonism(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/pd-dose', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.parkinsonDoseSchedule(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/et', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.essentialTremor(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/dystonia', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.dystonia(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
