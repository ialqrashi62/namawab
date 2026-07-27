// P3-DI pcc_cardiovascular_optimization_routes v3.73.0
// P3-DI: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_cardiovascular_optimization_engine.js');
const VER = '3.73.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_cardiovascular_optimization', label: 'PCC Cardiovascular Optimization', functions: Object.keys(Engine) });
});

router.post('/call/EndothelialFunction', (req, res) => { const r = Engine.EndothelialFunction(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'EndothelialFunction', plan: r.plan }); });
router.post('/call/LipidOptimization', (req, res) => { const r = Engine.LipidOptimization(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'LipidOptimization', plan: r.plan }); });
router.post('/call/BloodPressurePattern', (req, res) => { const r = Engine.BloodPressurePattern(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'BloodPressurePattern', plan: r.plan }); });
router.post('/call/HeartRateVariability', (req, res) => { const r = Engine.HeartRateVariability(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'HeartRateVariability', plan: r.plan }); });
router.post('/call/CardiacRehabAdvanced', (req, res) => { const r = Engine.CardiacRehabAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'CardiacRehabAdvanced', plan: r.plan }); });
router.post('/call/VascularStiffness', (req, res) => { const r = Engine.VascularStiffness(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'VascularStiffness', plan: r.plan }); });
router.post('/call/CoronaryRisk', (req, res) => { const r = Engine.CoronaryRisk(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'CoronaryRisk', plan: r.plan }); });
router.post('/call/StrokePrevention', (req, res) => { const r = Engine.StrokePrevention(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'StrokePrevention', plan: r.plan }); });
router.post('/call/CardiacNutrition', (req, res) => { const r = Engine.CardiacNutrition(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'CardiacNutrition', plan: r.plan }); });
router.post('/call/ExercisePrescription', (req, res) => { const r = Engine.ExercisePrescription(req.body || {}); res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: 'ExercisePrescription', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_cardiovascular_optimization', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
