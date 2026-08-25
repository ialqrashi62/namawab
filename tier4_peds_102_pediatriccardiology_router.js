'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_peds_102_pediatriccardiology_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-peds-pcard' }));
router.post('/kawasaki', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.kawasakiIncompleteEval(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/chd-cyanotic', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.chdCyanoticAssessment(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
