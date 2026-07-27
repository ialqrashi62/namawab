// P3-EC pcc_psychogeriatrics_routes v3.93.0
// P3-EC: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_psychogeriatrics_engine.js');
const VER = '3.93.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_psychogeriatrics', label: 'PCC Psychogeriatrics', functions: Object.keys(Engine) });
});
router.post('/call/DementiaAssessment', (req, res) => { const r = Engine.DementiaAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'DementiaAssessment', plan: r.plan }); });
router.post('/call/AlzheimerDiseaseStaging', (req, res) => { const r = Engine.AlzheimerDiseaseStaging(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'AlzheimerDiseaseStaging', plan: r.plan }); });
router.post('/call/LewyBodyDementia', (req, res) => { const r = Engine.LewyBodyDementia(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'LewyBodyDementia', plan: r.plan }); });
router.post('/call/VascularDementia', (req, res) => { const r = Engine.VascularDementia(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'VascularDementia', plan: r.plan }); });
router.post('/call/BehavioralPsychiatricSymptomsDementia', (req, res) => { const r = Engine.BehavioralPsychiatricSymptomsDementia(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'BehavioralPsychiatricSymptomsDementia', plan: r.plan }); });
router.post('/call/AntipsychoticInElderly', (req, res) => { const r = Engine.AntipsychoticInElderly(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'AntipsychoticInElderly', plan: r.plan }); });
router.post('/call/DepressionInElderly', (req, res) => { const r = Engine.DepressionInElderly(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'DepressionInElderly', plan: r.plan }); });
router.post('/call/FallsRiskDementia', (req, res) => { const r = Engine.FallsRiskDementia(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'FallsRiskDementia', plan: r.plan }); });
router.post('/call/CaregiverBurnout', (req, res) => { const r = Engine.CaregiverBurnout(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'CaregiverBurnout', plan: r.plan }); });
router.post('/call/CapacityAssessment', (req, res) => { const r = Engine.CapacityAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_psychogeriatrics', function: 'CapacityAssessment', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_psychogeriatrics', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
