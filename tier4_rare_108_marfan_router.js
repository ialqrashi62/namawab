'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_rare_108_marfan_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-rare-marfan' }));
router.post('/ghent', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.marfanGhentScore(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/aorta', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.marfanAorticSurveillance(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
