'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_ent_101_otology_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-ent-otology' }));
router.post('/ssnhl', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.suddenHearingLoss(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/cholesteatoma', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.cholesteatomaManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/bppv', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.bppvAssessment(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/om', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.otitisMedia(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
