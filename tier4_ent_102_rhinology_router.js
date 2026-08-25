'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_ent_102_rhinology_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-ent-rhinology' }));
router.post('/crs', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.chronicSinusitis(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/ari', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.allergicRhinitis(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/epistaxis', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.epistaxisTriage(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
