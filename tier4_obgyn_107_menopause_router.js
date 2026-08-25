'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_obgyn_107_menopause_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-obgyn-meno' }));
router.post('/mht', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.hormoneTherapyEligibility(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/bone', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.boneHealthScreening(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
