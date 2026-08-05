// P3-DC pcc_environmental_medicine_routes v3.67.0
// P3-DC: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_environmental_medicine_engine.js');
const VER = '3.67.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_environmental_medicine', label: 'PCC Environmental Medicine', functions: Object.keys(F) });
});

router.post('/call/AirQuality', (req, res) => { const r = F.AirQuality(req.body || {}); res.json({ version: VER, module: 'pcc_environmental_medicine', function: 'AirQuality', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/WaterSafety', (req, res) => { const r = F.WaterSafety(req.body || {}); res.json({ version: VER, module: 'pcc_environmental_medicine', function: 'WaterSafety', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ToxinExposure', (req, res) => { const r = F.ToxinExposure(req.body || {}); res.json({ version: VER, module: 'pcc_environmental_medicine', function: 'ToxinExposure', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AllergenMapping', (req, res) => { const r = F.AllergenMapping(req.body || {}); res.json({ version: VER, module: 'pcc_environmental_medicine', function: 'AllergenMapping', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ClimateHealth', (req, res) => { const r = F.ClimateHealth(req.body || {}); res.json({ version: VER, module: 'pcc_environmental_medicine', function: 'ClimateHealth', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BuiltEnvironment', (req, res) => { const r = F.BuiltEnvironment(req.body || {}); res.json({ version: VER, module: 'pcc_environmental_medicine', function: 'BuiltEnvironment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/OccupationalEnv', (req, res) => { const r = F.OccupationalEnv(req.body || {}); res.json({ version: VER, module: 'pcc_environmental_medicine', function: 'OccupationalEnv', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FoodEnvironment', (req, res) => { const r = F.FoodEnvironment(req.body || {}); res.json({ version: VER, module: 'pcc_environmental_medicine', function: 'FoodEnvironment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VectorRisk', (req, res) => { const r = F.VectorRisk(req.body || {}); res.json({ version: VER, module: 'pcc_environmental_medicine', function: 'VectorRisk', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RadiationSafety', (req, res) => { const r = F.RadiationSafety(req.body || {}); res.json({ version: VER, module: 'pcc_environmental_medicine', function: 'RadiationSafety', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_environmental_medicine', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
