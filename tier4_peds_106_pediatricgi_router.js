'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_peds_106_pediatricgi_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-peds-pgi' }));
router.post('/constipation', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.pediatricConstipation(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/celiac', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.pediatricCeliacScreening(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
