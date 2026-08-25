'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_rare_101_lysosomal_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-rare-lysosomal' }));
router.post('/manage', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.lysosomalDiseaseManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/fabry-cardiac', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.fabryCardiacRisk(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/gaucher-type', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.gaucherTypeClassification(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/nbs', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.newbornScreeningLSD(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/family-screening', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.familyScreeningLSD(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
