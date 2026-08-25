'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_derm_102_psoriasis_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-derm-psoriasis' }));
router.post('/severity', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.psoriasisSeverity(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/biologic', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.biologicSelection(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/psa-screen', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.psoriaticArthritisScreen(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
