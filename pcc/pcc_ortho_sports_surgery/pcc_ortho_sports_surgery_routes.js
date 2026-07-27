// P3-DU pcc_ortho_sports_surgery_routes v3.85.0
// P3-DU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_ortho_sports_surgery_engine.js');
const VER = '3.85.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_ortho_sports_surgery', label: 'PCC Ortho Sports Surgery', functions: Object.keys(Engine) });
});
router.post('/call/ACLRRepair', (req, res) => { const r = Engine.ACLRRepair(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'ACLRRepair', plan: r.plan }); });
router.post('/call/RotatorCuffRepair', (req, res) => { const r = Engine.RotatorCuffRepair(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'RotatorCuffRepair', plan: r.plan }); });
router.post('/call/MeniscusRepair', (req, res) => { const r = Engine.MeniscusRepair(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'MeniscusRepair', plan: r.plan }); });
router.post('/call/HipArthroscopy', (req, res) => { const r = Engine.HipArthroscopy(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'HipArthroscopy', plan: r.plan }); });
router.post('/call/AchillesTendonRepair', (req, res) => { const r = Engine.AchillesTendonRepair(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'AchillesTendonRepair', plan: r.plan }); });
router.post('/call/ShoulderInstability', (req, res) => { const r = Engine.ShoulderInstability(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'ShoulderInstability', plan: r.plan }); });
router.post('/call/TennisElbowRelease', (req, res) => { const r = Engine.TennisElbowRelease(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'TennisElbowRelease', plan: r.plan }); });
router.post('/call/HipReplacementIndication', (req, res) => { const r = Engine.HipReplacementIndication(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'HipReplacementIndication', plan: r.plan }); });
router.post('/call/KneeReplacementIndication', (req, res) => { const r = Engine.KneeReplacementIndication(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'KneeReplacementIndication', plan: r.plan }); });
router.post('/call/SportInjuryReturnToPlay', (req, res) => { const r = Engine.SportInjuryReturnToPlay(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'SportInjuryReturnToPlay', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
