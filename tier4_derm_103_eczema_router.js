'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_derm_103_eczema_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-derm-eczema' }));
router.post('/severity', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.eczemaSeverity(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/dupilumab', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.dupilumabProtocol(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/emollient', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.ezcemaEmollientSelection(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
