// P3-DF pcc_allergy_precision_routes v3.70.0
// P3-DF: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_allergy_precision_engine.js');
const VER = '3.70.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_allergy_precision', label: 'PCC Allergy Precision', functions: Object.keys(F) });
});

router.post('/call/AllergenComponent', (req, res) => { const r = F.AllergenComponent(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'AllergenComponent', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CrossReactivity', (req, res) => { const r = F.CrossReactivity(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'CrossReactivity', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/OralAllergy', (req, res) => { const r = F.OralAllergy(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'OralAllergy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DrugAllergyGenetics', (req, res) => { const r = F.DrugAllergyGenetics(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'DrugAllergyGenetics', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VenomAllergy', (req, res) => { const r = F.VenomAllergy(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'VenomAllergy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AtopicDermatitis', (req, res) => { const r = F.AtopicDermatitis(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'AtopicDermatitis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AllergicRhinitis', (req, res) => { const r = F.AllergicRhinitis(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'AllergicRhinitis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AsthmaAllergy', (req, res) => { const r = F.AsthmaAllergy(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'AsthmaAllergy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FoodChallenge', (req, res) => { const r = F.FoodChallenge(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'FoodChallenge', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Desensitization', (req, res) => { const r = F.Desensitization(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_precision', function: 'Desensitization', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_allergy_precision', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
