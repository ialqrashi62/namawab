// P3-DE pcc_nutritional_medicine_routes v3.69.0
// P3-DE: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_nutritional_medicine_engine.js');
const VER = '3.69.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_nutritional_medicine', label: 'PCC Nutritional Medicine', functions: Object.keys(F) });
});

router.post('/call/MacronutrientBalance', (req, res) => { const r = F.MacronutrientBalance(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'MacronutrientBalance', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MicronutrientStatus', (req, res) => { const r = F.MicronutrientStatus(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'MicronutrientStatus', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TherapeuticDiet', (req, res) => { const r = F.TherapeuticDiet(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'TherapeuticDiet', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/EnteralNutrition', (req, res) => { const r = F.EnteralNutrition(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'EnteralNutrition', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ParenteralNutrition', (req, res) => { const r = F.ParenteralNutrition(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'ParenteralNutrition', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MalnutritionScreen', (req, res) => { const r = F.MalnutritionScreen(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'MalnutritionScreen', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FoodAllergy', (req, res) => { const r = F.FoodAllergy(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'FoodAllergy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/EatingDisorder', (req, res) => { const r = F.EatingDisorder(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'EatingDisorder', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SportsNutrition', (req, res) => { const r = F.SportsNutrition(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'SportsNutrition', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CancerNutrition', (req, res) => { const r = F.CancerNutrition(req.body || {}); res.json({ version: VER, module: 'pcc_nutritional_medicine', function: 'CancerNutrition', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_nutritional_medicine', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
