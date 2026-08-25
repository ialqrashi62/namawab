'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_peds_101_neonatology_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-peds-nicu' }));
router.post('/apgar', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.apgarScoring(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/respiratory', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.neonatalRespiratoryCare(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/nec', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.necBellStaging(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/bili', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.neonatalHyperbilirubinemia(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/sepsis', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.neonatalSepsisPathway(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
