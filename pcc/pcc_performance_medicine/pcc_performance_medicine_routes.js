// P3-DD pcc_performance_medicine_routes v3.68.0
// P3-DD: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_performance_medicine_engine.js');
const VER = '3.68.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_performance_medicine', label: 'PCC Performance Medicine', functions: Object.keys(Engine) });
});

router.post('/call/VO2Max', (req, res) => { const r = Engine.VO2Max(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'VO2Max', plan: r.plan }); });
router.post('/call/LactateThreshold', (req, res) => { const r = Engine.LactateThreshold(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'LactateThreshold', plan: r.plan }); });
router.post('/call/MovementScreen', (req, res) => { const r = Engine.MovementScreen(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'MovementScreen', plan: r.plan }); });
router.post('/call/CognitivePerformance', (req, res) => { const r = Engine.CognitivePerformance(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'CognitivePerformance', plan: r.plan }); });
router.post('/call/HRVMonitoring', (req, res) => { const r = Engine.HRVMonitoring(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'HRVMonitoring', plan: r.plan }); });
router.post('/call/SleepForPerformance', (req, res) => { const r = Engine.SleepForPerformance(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'SleepForPerformance', plan: r.plan }); });
router.post('/call/MentalSkills', (req, res) => { const r = Engine.MentalSkills(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'MentalSkills', plan: r.plan }); });
router.post('/call/EquipmentOptimization', (req, res) => { const r = Engine.EquipmentOptimization(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'EquipmentOptimization', plan: r.plan }); });
router.post('/call/PeriodizationPlan', (req, res) => { const r = Engine.PeriodizationPlan(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'PeriodizationPlan', plan: r.plan }); });
router.post('/call/Overtraining', (req, res) => { const r = Engine.Overtraining(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'Overtraining', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_performance_medicine', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
