'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_peds_105_pediatricendocrinology_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-peds-pendo' }));
router.post('/dka', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.pediatricDkaManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/growth', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.pediatricGrowthEvaluation(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
