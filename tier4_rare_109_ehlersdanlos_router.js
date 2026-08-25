'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_rare_109_ehlersdanlos_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-rare-eds' }));
router.post('/classify', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.edsClassification(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/rehab', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.edsPainAndRehab(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
