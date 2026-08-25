'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_cardio_108_htn_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-cardio-htn' }));
router.post('/classify', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.htClassification(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/crisis', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.htCrisis(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/resistant', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.resistHt(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
