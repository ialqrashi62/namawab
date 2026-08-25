'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_rare_110_pheochromocytoma_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-rare-ppgl' }));
router.post('/biochem', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.ppglBiochemicalDx(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/alpha-blockade', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.ppglAlphaBlockade(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
