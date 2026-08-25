'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_rare_112_neurofibromatosis_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-rare-nf' }));
router.post('/nf1', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.nf1Diagnosis(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/nf2', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.nf2Management(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
