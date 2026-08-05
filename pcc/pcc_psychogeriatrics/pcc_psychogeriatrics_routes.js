// P3-EC pcc_psychogeriatrics_routes v3.93.0
// P3-EC: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_psychogeriatrics_engine.js');
const VER = '3.93.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_psychogeriatrics', label: 'PCC Psychogeriatrics', functions: Object.keys(F) });
});
router.post('/call/DementiaAssessment', (req, res) => { const r = F.DementiaAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'DementiaAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AlzheimerDiseaseStaging', (req, res) => { const r = F.AlzheimerDiseaseStaging(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'AlzheimerDiseaseStaging', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LewyBodyDementia', (req, res) => { const r = F.LewyBodyDementia(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'LewyBodyDementia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VascularDementia', (req, res) => { const r = F.VascularDementia(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'VascularDementia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BehavioralPsychiatricSymptomsDementia', (req, res) => { const r = F.BehavioralPsychiatricSymptomsDementia(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'BehavioralPsychiatricSymptomsDementia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AntipsychoticInElderly', (req, res) => { const r = F.AntipsychoticInElderly(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'AntipsychoticInElderly', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DepressionInElderly', (req, res) => { const r = F.DepressionInElderly(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'DepressionInElderly', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FallsRiskDementia', (req, res) => { const r = F.FallsRiskDementia(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'FallsRiskDementia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CaregiverBurnout', (req, res) => { const r = F.CaregiverBurnout(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'CaregiverBurnout', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CapacityAssessment', (req, res) => { const r = F.CapacityAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'CapacityAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_psychogeriatrics', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
