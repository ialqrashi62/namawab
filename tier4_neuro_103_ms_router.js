'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_neuro_103_ms_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-neuro-ms' }));
router.post('/diagnose', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.msDiagnosis(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/dmt', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.msDmtSelection(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/relapse', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.msRelapse(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
