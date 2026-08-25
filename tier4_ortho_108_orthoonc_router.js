'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_ortho_108_orthoonc_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-ortho-onc' }));
router.post('/lesion', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.boneLesionWorkup(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/osteosarcoma', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.osteosarcomaProtocol(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/soft-tissue', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.softTissueMass(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
