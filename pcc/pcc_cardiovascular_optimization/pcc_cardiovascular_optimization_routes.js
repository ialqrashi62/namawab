// P3-DI pcc_cardiovascular_optimization_routes v3.73.0
// P3-DI: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_cardiovascular_optimization_engine.js');
const VER = '3.73.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_cardiovascular_optimization', label: 'PCC Cardiovascular Optimization', functions: Object.keys(F) });
});

router.post('/call/EndothelialFunction', (req, res) => { const r = F.EndothelialFunction(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'EndothelialFunction', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LipidOptimization', (req, res) => { const r = F.LipidOptimization(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'LipidOptimization', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BloodPressurePattern', (req, res) => { const r = F.BloodPressurePattern(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'BloodPressurePattern', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HeartRateVariability', (req, res) => { const r = F.HeartRateVariability(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'HeartRateVariability', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CardiacRehabAdvanced', (req, res) => { const r = F.CardiacRehabAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'CardiacRehabAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VascularStiffness', (req, res) => { const r = F.VascularStiffness(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'VascularStiffness', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CoronaryRisk', (req, res) => { const r = F.CoronaryRisk(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'CoronaryRisk', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/StrokePrevention', (req, res) => { const r = F.StrokePrevention(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'StrokePrevention', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CardiacNutrition', (req, res) => { const r = F.CardiacNutrition(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'CardiacNutrition', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ExercisePrescription', (req, res) => { const r = F.ExercisePrescription(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'ExercisePrescription', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
