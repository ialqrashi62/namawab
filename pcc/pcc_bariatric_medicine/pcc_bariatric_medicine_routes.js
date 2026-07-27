// P3-DY pcc_bariatric_medicine_routes v3.89.0
// P3-DY: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_bariatric_medicine_engine.js');
const VER = '3.89.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_bariatric_medicine', label: 'PCC Bariatric Medicine', functions: Object.keys(Engine) });
});
router.post('/call/BMIClassification', (req, res) => { const r = Engine.BMIClassification(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'BMIClassification', plan: r.plan }); });
router.post('/call/BariatricSurgeryEligibility', (req, res) => { const r = Engine.BariatricSurgeryEligibility(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'BariatricSurgeryEligibility', plan: r.plan }); });
router.post('/call/RouxEnYIndication', (req, res) => { const r = Engine.RouxEnYIndication(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'RouxEnYIndication', plan: r.plan }); });
router.post('/call/SleeveGastrectomySelection', (req, res) => { const r = Engine.SleeveGastrectomySelection(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'SleeveGastrectomySelection', plan: r.plan }); });
router.post('/call/GastricBypassRevision', (req, res) => { const r = Engine.GastricBypassRevision(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'GastricBypassRevision', plan: r.plan }); });
router.post('/call/PostBariatricNutrition', (req, res) => { const r = Engine.PostBariatricNutrition(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'PostBariatricNutrition', plan: r.plan }); });
router.post('/call/BariatricPsychEval', (req, res) => { const r = Engine.BariatricPsychEval(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'BariatricPsychEval', plan: r.plan }); });
router.post('/call/WeightRegainManagement', (req, res) => { const r = Engine.WeightRegainManagement(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'WeightRegainManagement', plan: r.plan }); });
router.post('/call/BariatricComplications', (req, res) => { const r = Engine.BariatricComplications(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'BariatricComplications', plan: r.plan }); });
router.post('/call/MetabolicSurgeryOutcomes', (req, res) => { const r = Engine.MetabolicSurgeryOutcomes(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'MetabolicSurgeryOutcomes', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_bariatric_medicine', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
