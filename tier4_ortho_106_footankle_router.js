'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_ortho_106_footankle_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-ortho-footankle' }));
router.post('/ankle-fx', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.ankleFracture(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/bunion', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.halluxValgus(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/diabetic-foot', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.diabeticFootRisk(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
