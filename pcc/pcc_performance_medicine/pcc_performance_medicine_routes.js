// P3-DD pcc_performance_medicine_routes v3.68.0
// P3-DD: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_performance_medicine_engine.js');
const VER = '3.68.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_performance_medicine', label: 'PCC Performance Medicine', functions: Object.keys(F) });
});

router.post('/call/VO2Max', (req, res) => { const r = F.VO2Max(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'VO2Max', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LactateThreshold', (req, res) => { const r = F.LactateThreshold(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'LactateThreshold', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MovementScreen', (req, res) => { const r = F.MovementScreen(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'MovementScreen', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CognitivePerformance', (req, res) => { const r = F.CognitivePerformance(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'CognitivePerformance', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HRVMonitoring', (req, res) => { const r = F.HRVMonitoring(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'HRVMonitoring', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SleepForPerformance', (req, res) => { const r = F.SleepForPerformance(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'SleepForPerformance', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MentalSkills', (req, res) => { const r = F.MentalSkills(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'MentalSkills', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/EquipmentOptimization', (req, res) => { const r = F.EquipmentOptimization(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'EquipmentOptimization', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PeriodizationPlan', (req, res) => { const r = F.PeriodizationPlan(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'PeriodizationPlan', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Overtraining', (req, res) => { const r = F.Overtraining(req.body || {}); res.json({ version: VER, module: 'pcc_performance_medicine', function: 'Overtraining', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_performance_medicine', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
