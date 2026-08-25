'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_ortho_105_hand_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-ortho-hand' }));
router.post('/cts', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.carpalTunnel(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/distal-radius', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.distalRadiusFx(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/laceration', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.fingerLaceration(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
