// P3-EF pcc_neuropsychology_routes v3.96.0
// P3-EF: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neuropsychology_engine.js');
const VER = '3.96.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuropsychology', label: 'PCC Neuropsychology', functions: Object.keys(F) });
});
router.post('/call/NeuropsychologicalAssessment', (req, res) => { const r = F.NeuropsychologicalAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'NeuropsychologicalAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CognitiveRehabilitationPlan', (req, res) => { const r = F.CognitiveRehabilitationPlan(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'CognitiveRehabilitationPlan', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DementiaDifferential', (req, res) => { const r = F.DementiaDifferential(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'DementiaDifferential', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TraumaticBrainInjuryEval', (req, res) => { const r = F.TraumaticBrainInjuryEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'TraumaticBrainInjuryEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ADHDAdultAssessment', (req, res) => { const r = F.ADHDAdultAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'ADHDAdultAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AutismSpectrumEval', (req, res) => { const r = F.AutismSpectrumEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'AutismSpectrumEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LearningDisorderEval', (req, res) => { const r = F.LearningDisorderEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'LearningDisorderEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ExecutiveFunctionAssessment', (req, res) => { const r = F.ExecutiveFunctionAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'ExecutiveFunctionAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MemoryDisorderEval', (req, res) => { const r = F.MemoryDisorderEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'MemoryDisorderEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeuropsychiatricSyndrome', (req, res) => { const r = F.NeuropsychiatricSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsychology', function: 'NeuropsychiatricSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuropsychology', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
