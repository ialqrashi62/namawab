'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_rare_107_wilson_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-rare-wilson' }));
router.post('/diagnose', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.wilsonDiseaseDiagnosis(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/treat', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.wilsonDiseaseTreatment(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
