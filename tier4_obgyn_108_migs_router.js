'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_obgyn_108_migs_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-obgyn-migs' }));
router.post('/fibroid', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.fibroidManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/endometriosis', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.endometriosisManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
