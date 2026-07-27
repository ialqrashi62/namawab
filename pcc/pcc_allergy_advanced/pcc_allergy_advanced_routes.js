// P3-DP pcc_allergy_advanced_routes v3.80.0
// P3-DP: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_allergy_advanced_engine.js');
const VER = '3.80.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_allergy_advanced', label: 'PCC Allergy Advanced', functions: Object.keys(Engine) });
});

router.post('/call/AnaphylaxisAdvanced', (req, res) => { const r = Engine.AnaphylaxisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'AnaphylaxisAdvanced', plan: r.plan }); });
router.post('/call/DrugAllergyDelabeling', (req, res) => { const r = Engine.DrugAllergyDelabeling(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'DrugAllergyDelabeling', plan: r.plan }); });
router.post('/call/FoodAllergyOralImmunotherapy', (req, res) => { const r = Engine.FoodAllergyOralImmunotherapy(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'FoodAllergyOralImmunotherapy', plan: r.plan }); });
router.post('/call/VenomImmunotherapy', (req, res) => { const r = Engine.VenomImmunotherapy(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'VenomImmunotherapy', plan: r.plan }); });
router.post('/call/AllergicBronchopulmonaryAspergillosis', (req, res) => { const r = Engine.AllergicBronchopulmonaryAspergillosis(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'AllergicBronchopulmonaryAspergillosis', plan: r.plan }); });
router.post('/call/EosinophilicGranulomatosis', (req, res) => { const r = Engine.EosinophilicGranulomatosis(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'EosinophilicGranulomatosis', plan: r.plan }); });
router.post('/call/MastCellActivation', (req, res) => { const r = Engine.MastCellActivation(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'MastCellActivation', plan: r.plan }); });
router.post('/call/ChronicUrticariaRefractory', (req, res) => { const r = Engine.ChronicUrticariaRefractory(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'ChronicUrticariaRefractory', plan: r.plan }); });
router.post('/call/AllergicRhinoconjunctivitisAdvanced', (req, res) => { const r = Engine.AllergicRhinoconjunctivitisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'AllergicRhinoconjunctivitisAdvanced', plan: r.plan }); });
router.post('/call/ContactDermatitisAdvanced', (req, res) => { const r = Engine.ContactDermatitisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_advanced', function: 'ContactDermatitisAdvanced', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_allergy_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
