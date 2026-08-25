'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_ent_106_facial_plastics_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-ent-facialplas' }));
router.post('/septorhinoplasty', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.septorhinoplastyIndication(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/trans-fracture', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.facialTraumaRepair(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/defect', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.skinCancerReconstruction(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
