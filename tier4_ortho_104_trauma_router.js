'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_ortho_104_trauma_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-ortho-trauma' }));
router.post('/hip-fx', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.hipFractureManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/open-fx', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.openFractureManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/pelvis', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.pelvisFracture(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/compartment', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.compartmentSyndrome(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
