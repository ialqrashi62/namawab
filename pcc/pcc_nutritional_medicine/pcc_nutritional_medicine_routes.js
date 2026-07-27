// P3-DE pcc_nutritional_medicine_routes v3.69.0
// P3-DE: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_nutritional_medicine_engine.js');
const VER = '3.69.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_nutritional_medicine', label: 'PCC Nutritional Medicine', functions: Object.keys(Engine) });
});

router.post('/call/MacronutrientBalance', (req, res) => { const r = Engine.MacronutrientBalance(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'MacronutrientBalance', plan: r.plan }); });
router.post('/call/MicronutrientStatus', (req, res) => { const r = Engine.MicronutrientStatus(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'MicronutrientStatus', plan: r.plan }); });
router.post('/call/TherapeuticDiet', (req, res) => { const r = Engine.TherapeuticDiet(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'TherapeuticDiet', plan: r.plan }); });
router.post('/call/EnteralNutrition', (req, res) => { const r = Engine.EnteralNutrition(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'EnteralNutrition', plan: r.plan }); });
router.post('/call/ParenteralNutrition', (req, res) => { const r = Engine.ParenteralNutrition(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'ParenteralNutrition', plan: r.plan }); });
router.post('/call/MalnutritionScreen', (req, res) => { const r = Engine.MalnutritionScreen(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'MalnutritionScreen', plan: r.plan }); });
router.post('/call/FoodAllergy', (req, res) => { const r = Engine.FoodAllergy(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'FoodAllergy', plan: r.plan }); });
router.post('/call/EatingDisorder', (req, res) => { const r = Engine.EatingDisorder(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'EatingDisorder', plan: r.plan }); });
router.post('/call/SportsNutrition', (req, res) => { const r = Engine.SportsNutrition(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'SportsNutrition', plan: r.plan }); });
router.post('/call/CancerNutrition', (req, res) => { const r = Engine.CancerNutrition(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'CancerNutrition', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_nutritional_medicine', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
