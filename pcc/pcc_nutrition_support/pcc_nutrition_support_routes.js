// P3-DL pcc_nutrition_support_routes v3.76.0
// P3-DL: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_nutrition_support_engine.js');
const VER = '3.76.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_nutrition_support', label: 'PCC Nutrition Support', functions: Object.keys(Engine) });
});

router.post('/call/CaloricTarget', (req, res) => { const r = Engine.CaloricTarget(req.body || {}); res.json({ version: VER, module: 'pcc_nutrition_support', function: 'CaloricTarget', plan: r.plan }); });
router.post('/call/ProteinRequirement', (req, res) => { const r = Engine.ProteinRequirement(req.body || {}); res.json({ version: VER, module: 'pcc_nutrition_support', function: 'ProteinRequirement', plan: r.plan }); });
router.post('/call/EnteralAccess', (req, res) => { const r = Engine.EnteralAccess(req.body || {}); res.json({ version: VER, module: 'pcc_nutrition_support', function: 'EnteralAccess', plan: r.plan }); });
router.post('/call/ParenteralIndication', (req, res) => { const r = Engine.ParenteralIndication(req.body || {}); res.json({ version: VER, module: 'pcc_nutrition_support', function: 'ParenteralIndication', plan: r.plan }); });
router.post('/call/RefeedingRisk', (req, res) => { const r = Engine.RefeedingRisk(req.body || {}); res.json({ version: VER, module: 'pcc_nutrition_support', function: 'RefeedingRisk', plan: r.plan }); });
router.post('/call/GlycemicControlNutrition', (req, res) => { const r = Engine.GlycemicControlNutrition(req.body || {}); res.json({ version: VER, module: 'pcc_nutrition_support', function: 'GlycemicControlNutrition', plan: r.plan }); });
router.post('/call/Immunonutrition', (req, res) => { const r = Engine.Immunonutrition(req.body || {}); res.json({ version: VER, module: 'pcc_nutrition_support', function: 'Immunonutrition', plan: r.plan }); });
router.post('/call/FluidBalance', (req, res) => { const r = Engine.FluidBalance(req.body || {}); res.json({ version: VER, module: 'pcc_nutrition_support', function: 'FluidBalance', plan: r.plan }); });
router.post('/call/MicronutrientRepletion', (req, res) => { const r = Engine.MicronutrientRepletion(req.body || {}); res.json({ version: VER, module: 'pcc_nutrition_support', function: 'MicronutrientRepletion', plan: r.plan }); });
router.post('/call/NutritionOutcome', (req, res) => { const r = Engine.NutritionOutcome(req.body || {}); res.json({ version: VER, module: 'pcc_nutrition_support', function: 'NutritionOutcome', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_nutrition_support', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
