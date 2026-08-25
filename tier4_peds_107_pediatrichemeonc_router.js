'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_peds_107_pediatrichemeonc_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-peds-phemeonc' }));
router.post('/neutropenic-fever', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.neutropenicFever(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/sickle-cell', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.sickleCellCrisis(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
