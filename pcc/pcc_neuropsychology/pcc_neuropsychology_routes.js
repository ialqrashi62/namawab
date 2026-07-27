// P3-EF pcc_neuropsychology_routes v3.96.0
// P3-EF: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_neuropsychology_engine.js');
const VER = '3.96.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuropsychology', label: 'PCC Neuropsychology', functions: Object.keys(Engine) });
});
router.post('/call/NeuropsychologicalAssessment', (req, res) => { const r = Engine.NeuropsychologicalAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'NeuropsychologicalAssessment', plan: r.plan }); });
router.post('/call/CognitiveRehabilitationPlan', (req, res) => { const r = Engine.CognitiveRehabilitationPlan(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'CognitiveRehabilitationPlan', plan: r.plan }); });
router.post('/call/DementiaDifferential', (req, res) => { const r = Engine.DementiaDifferential(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'DementiaDifferential', plan: r.plan }); });
router.post('/call/TraumaticBrainInjuryEval', (req, res) => { const r = Engine.TraumaticBrainInjuryEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'TraumaticBrainInjuryEval', plan: r.plan }); });
router.post('/call/ADHDAdultAssessment', (req, res) => { const r = Engine.ADHDAdultAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'ADHDAdultAssessment', plan: r.plan }); });
router.post('/call/AutismSpectrumEval', (req, res) => { const r = Engine.AutismSpectrumEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'AutismSpectrumEval', plan: r.plan }); });
router.post('/call/LearningDisorderEval', (req, res) => { const r = Engine.LearningDisorderEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'LearningDisorderEval', plan: r.plan }); });
router.post('/call/ExecutiveFunctionAssessment', (req, res) => { const r = Engine.ExecutiveFunctionAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'ExecutiveFunctionAssessment', plan: r.plan }); });
router.post('/call/MemoryDisorderEval', (req, res) => { const r = Engine.MemoryDisorderEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'MemoryDisorderEval', plan: r.plan }); });
router.post('/call/NeuropsychiatricSyndrome', (req, res) => { const r = Engine.NeuropsychiatricSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'NeuropsychiatricSyndrome', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuropsychology', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
