// P3-DF pcc_allergy_precision_routes v3.70.0
// P3-DF: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_allergy_precision_engine.js');
const VER = '3.70.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_allergy_precision', label: 'PCC Allergy Precision', functions: Object.keys(Engine) });
});

router.post('/call/AllergenComponent', (req, res) => { const r = Engine.AllergenComponent(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'AllergenComponent', plan: r.plan }); });
router.post('/call/CrossReactivity', (req, res) => { const r = Engine.CrossReactivity(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'CrossReactivity', plan: r.plan }); });
router.post('/call/OralAllergy', (req, res) => { const r = Engine.OralAllergy(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'OralAllergy', plan: r.plan }); });
router.post('/call/DrugAllergyGenetics', (req, res) => { const r = Engine.DrugAllergyGenetics(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'DrugAllergyGenetics', plan: r.plan }); });
router.post('/call/VenomAllergy', (req, res) => { const r = Engine.VenomAllergy(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'VenomAllergy', plan: r.plan }); });
router.post('/call/AtopicDermatitis', (req, res) => { const r = Engine.AtopicDermatitis(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'AtopicDermatitis', plan: r.plan }); });
router.post('/call/AllergicRhinitis', (req, res) => { const r = Engine.AllergicRhinitis(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'AllergicRhinitis', plan: r.plan }); });
router.post('/call/AsthmaAllergy', (req, res) => { const r = Engine.AsthmaAllergy(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'AsthmaAllergy', plan: r.plan }); });
router.post('/call/FoodChallenge', (req, res) => { const r = Engine.FoodChallenge(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'FoodChallenge', plan: r.plan }); });
router.post('/call/Desensitization', (req, res) => { const r = Engine.Desensitization(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'Desensitization', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_allergy_precision', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
