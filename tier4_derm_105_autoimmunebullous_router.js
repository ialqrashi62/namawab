'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_derm_105_autoimmunebullous_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-derm-bullous' }));
router.post('/pemphigus', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.pemphigusVs(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/bp', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.bullousPemphigoidManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/algorithm', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.bullousDiagnosisAlgorithm(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
