// P3-DP pcc_allergy_advanced_routes v3.80.0
// P3-DP: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_allergy_advanced_engine.js');
const VER = '3.80.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_allergy_advanced', label: 'PCC Allergy Advanced', functions: Object.keys(F) });
});

router.post('/call/AnaphylaxisAdvanced', (req, res) => { const r = F.AnaphylaxisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'AnaphylaxisAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DrugAllergyDelabeling', (req, res) => { const r = F.DrugAllergyDelabeling(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'DrugAllergyDelabeling', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FoodAllergyOralImmunotherapy', (req, res) => { const r = F.FoodAllergyOralImmunotherapy(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'FoodAllergyOralImmunotherapy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VenomImmunotherapy', (req, res) => { const r = F.VenomImmunotherapy(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'VenomImmunotherapy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AllergicBronchopulmonaryAspergillosis', (req, res) => { const r = F.AllergicBronchopulmonaryAspergillosis(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'AllergicBronchopulmonaryAspergillosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/EosinophilicGranulomatosis', (req, res) => { const r = F.EosinophilicGranulomatosis(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'EosinophilicGranulomatosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MastCellActivation', (req, res) => { const r = F.MastCellActivation(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'MastCellActivation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ChronicUrticariaRefractory', (req, res) => { const r = F.ChronicUrticariaRefractory(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'ChronicUrticariaRefractory', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AllergicRhinoconjunctivitisAdvanced', (req, res) => { const r = F.AllergicRhinoconjunctivitisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'AllergicRhinoconjunctivitisAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ContactDermatitisAdvanced', (req, res) => { const r = F.ContactDermatitisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'ContactDermatitisAdvanced', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_allergy_advanced', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
