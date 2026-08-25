'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_rare_106_sarcoidosis_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-rare-sarc' }));
router.post('/phenotype', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.sarcoidosisPhenotyping(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/cardiac', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.cardiacSarcoidosisManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/pulmonary', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.pulmonarySarcoidStaging(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/neuro', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.neurosarcoidosisWorkup(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/treatment', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.sarcoidTreatmentPathway(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
