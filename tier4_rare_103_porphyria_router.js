'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_rare_103_porphyria_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-rare-porphyria' }));
router.post('/ahp-attack', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.acuteHepaticPorphyriaAttack(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/cutaneous', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.cutaneousPorphyriaManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/drug-safety', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.porphyriaSafeDrugList(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/givosiran', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.givosiranEligibility(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/family-screening', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.familyScreeningPorphyria(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
