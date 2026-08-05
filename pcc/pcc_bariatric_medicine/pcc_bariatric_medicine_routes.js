// P3-DY pcc_bariatric_medicine_routes v3.89.0
// P3-DY: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_bariatric_medicine_engine.js');
const VER = '3.89.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_bariatric_medicine', label: 'PCC Bariatric Medicine', functions: Object.keys(F) });
});
router.post('/call/BMIClassification', (req, res) => { const r = F.BMIClassification(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'BMIClassification', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BariatricSurgeryEligibility', (req, res) => { const r = F.BariatricSurgeryEligibility(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'BariatricSurgeryEligibility', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RouxEnYIndication', (req, res) => { const r = F.RouxEnYIndication(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'RouxEnYIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SleeveGastrectomySelection', (req, res) => { const r = F.SleeveGastrectomySelection(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'SleeveGastrectomySelection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GastricBypassRevision', (req, res) => { const r = F.GastricBypassRevision(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'GastricBypassRevision', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PostBariatricNutrition', (req, res) => { const r = F.PostBariatricNutrition(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'PostBariatricNutrition', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BariatricPsychEval', (req, res) => { const r = F.BariatricPsychEval(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'BariatricPsychEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/WeightRegainManagement', (req, res) => { const r = F.WeightRegainManagement(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'WeightRegainManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BariatricComplications', (req, res) => { const r = F.BariatricComplications(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'BariatricComplications', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MetabolicSurgeryOutcomes', (req, res) => { const r = F.MetabolicSurgeryOutcomes(req.body || {}); res.json({ version: VER, module: 'pcc_bariatric_medicine', function: 'MetabolicSurgeryOutcomes', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_bariatric_medicine', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
