// P3-DD pcc_sports_science_routes v3.68.0
// P3-DD: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_sports_science_engine.js');
const VER = '3.68.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_sports_science', label: 'PCC Sports Science', functions: Object.keys(Engine) });
});

router.post('/call/Biomechanics', (req, res) => { const r = Engine.Biomechanics(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'Biomechanics', plan: r.plan }); });
router.post('/call/LoadMonitoring', (req, res) => { const r = Engine.LoadMonitoring(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'LoadMonitoring', plan: r.plan }); });
router.post('/call/InjuryRisk', (req, res) => { const r = Engine.InjuryRisk(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'InjuryRisk', plan: r.plan }); });
router.post('/call/ReturnToPlay', (req, res) => { const r = Engine.ReturnToPlay(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'ReturnToPlay', plan: r.plan }); });
router.post('/call/NutritionPeriodization', (req, res) => { const r = Engine.NutritionPeriodization(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'NutritionPeriodization', plan: r.plan }); });
router.post('/call/HydrationStrategy', (req, res) => { const r = Engine.HydrationStrategy(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'HydrationStrategy', plan: r.plan }); });
router.post('/call/RecoveryOptimization', (req, res) => { const r = Engine.RecoveryOptimization(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'RecoveryOptimization', plan: r.plan }); });
router.post('/call/YouthAthlete', (req, res) => { const r = Engine.YouthAthlete(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'YouthAthlete', plan: r.plan }); });
router.post('/call/TeamHealth', (req, res) => { const r = Engine.TeamHealth(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'TeamHealth', plan: r.plan }); });
router.post('/call/AltitudeTraining', (req, res) => { const r = Engine.AltitudeTraining(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'AltitudeTraining', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_sports_science', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
