'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_rare_105_amyloidosis_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-rare-amyloid' }));
router.post('/workup', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.amyloidosisWorkup(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/cardiac-stage', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.cardiacAmyloidStaging(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/al-therapy', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.alAmyloidTherapy(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/attr-therapy', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.attrSilencerTherapy(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/family-screening', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.amyloidosisFamilyScreening(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
