'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_peds_104_pediatricpulmonology_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-peds-ppulm' }));
router.post('/asthma', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.pediatricAsthmaControl(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/bronchiolitis', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.bronchiolitisSeverity(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
