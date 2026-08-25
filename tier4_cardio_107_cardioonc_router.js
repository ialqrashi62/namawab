'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_cardio_107_cardioonc_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-cardio-onc' }));
router.post('/risk', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.chemoCardiotoxRisk(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/icd', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.icdPrevention(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/radiation', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.radiationHeartDisease(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
