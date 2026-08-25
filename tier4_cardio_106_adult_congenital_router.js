'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_cardio_106_adult_congenital_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-cardio-achd' }));
router.post('/eval', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.achdEvaluation(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/fontan', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.fontanFollowUp(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/acyanotic', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.acyanoticLesion(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
