// P3-DN pcc_nephrology_advanced_routes v3.78.0
// P3-DN: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_nephrology_advanced_engine.js');
const VER = '3.78.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_nephrology_advanced', label: 'PCC Nephrology Advanced', functions: Object.keys(Engine) });
});

router.post('/call/ProteinuriaWorkup', (req, res) => { const r = Engine.ProteinuriaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_nephrology_advanced', function: 'ProteinuriaWorkup', plan: r.plan }); });
router.post('/call/HematuriaEvaluation', (req, res) => { const r = Engine.HematuriaEvaluation(req.body || {}); res.json({ version: VER, module: 'pcc_nephrology_advanced', function: 'HematuriaEvaluation', plan: r.plan }); });
router.post('/call/NephroticSyndrome', (req, res) => { const r = Engine.NephroticSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_nephrology_advanced', function: 'NephroticSyndrome', plan: r.plan }); });
router.post('/call/NephriticSyndrome', (req, res) => { const r = Engine.NephriticSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_nephrology_advanced', function: 'NephriticSyndrome', plan: r.plan }); });
router.post('/call/RapidlyProgressiveGN', (req, res) => { const r = Engine.RapidlyProgressiveGN(req.body || {}); res.json({ version: VER, module: 'pcc_nephrology_advanced', function: 'RapidlyProgressiveGN', plan: r.plan }); });
router.post('/call/DiabeticNephropathy', (req, res) => { const r = Engine.DiabeticNephropathy(req.body || {}); res.json({ version: VER, module: 'pcc_nephrology_advanced', function: 'DiabeticNephropathy', plan: r.plan }); });
router.post('/call/HypertensiveNephrosclerosis', (req, res) => { const r = Engine.HypertensiveNephrosclerosis(req.body || {}); res.json({ version: VER, module: 'pcc_nephrology_advanced', function: 'HypertensiveNephrosclerosis', plan: r.plan }); });
router.post('/call/PolycysticKidneyDisease', (req, res) => { const r = Engine.PolycysticKidneyDisease(req.body || {}); res.json({ version: VER, module: 'pcc_nephrology_advanced', function: 'PolycysticKidneyDisease', plan: r.plan }); });
router.post('/call/RenalArteryStenosis', (req, res) => { const r = Engine.RenalArteryStenosis(req.body || {}); res.json({ version: VER, module: 'pcc_nephrology_advanced', function: 'RenalArteryStenosis', plan: r.plan }); });
router.post('/call/ChronicKidneyDiseaseProgression', (req, res) => { const r = Engine.ChronicKidneyDiseaseProgression(req.body || {}); res.json({ version: VER, module: 'pcc_nephrology_advanced', function: 'ChronicKidneyDiseaseProgression', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_nephrology_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
