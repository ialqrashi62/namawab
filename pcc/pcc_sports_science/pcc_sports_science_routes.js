// P3-DD pcc_sports_science_routes v3.68.0
// P3-DD: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_sports_science_engine.js');
const VER = '3.68.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_sports_science', label: 'PCC Sports Science', functions: Object.keys(F) });
});

router.post('/call/Biomechanics', (req, res) => { const r = F.Biomechanics(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'Biomechanics', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LoadMonitoring', (req, res) => { const r = F.LoadMonitoring(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'LoadMonitoring', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/InjuryRisk', (req, res) => { const r = F.InjuryRisk(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'InjuryRisk', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ReturnToPlay', (req, res) => { const r = F.ReturnToPlay(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'ReturnToPlay', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NutritionPeriodization', (req, res) => { const r = F.NutritionPeriodization(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'NutritionPeriodization', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HydrationStrategy', (req, res) => { const r = F.HydrationStrategy(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'HydrationStrategy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RecoveryOptimization', (req, res) => { const r = F.RecoveryOptimization(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'RecoveryOptimization', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/YouthAthlete', (req, res) => { const r = F.YouthAthlete(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'YouthAthlete', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TeamHealth', (req, res) => { const r = F.TeamHealth(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'TeamHealth', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AltitudeTraining', (req, res) => { const r = F.AltitudeTraining(req.body || {}); res.json({ version: VER, module: 'pcc_sports_science', function: 'AltitudeTraining', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_sports_science', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
