// P3-DX pcc_sleep_clinic_routes v3.88.0
// P3-DX: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_sleep_clinic_engine.js');
const VER = '3.88.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_sleep_clinic', label: 'PCC Sleep Clinic', functions: Object.keys(Engine) });
});
router.post('/call/PolysomnographyInterpretation', (req, res) => { const r = Engine.PolysomnographyInterpretation(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'PolysomnographyInterpretation', plan: r.plan }); });
router.post('/call/OSAHSeverityStratification', (req, res) => { const r = Engine.OSAHSeverityStratification(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'OSAHSeverityStratification', plan: r.plan }); });
router.post('/call/CPAPTitrationProtocol', (req, res) => { const r = Engine.CPAPTitrationProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'CPAPTitrationProtocol', plan: r.plan }); });
router.post('/call/BiPAPIndication', (req, res) => { const r = Engine.BiPAPIndication(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'BiPAPIndication', plan: r.plan }); });
router.post('/call/InsomniaCBTProtocol', (req, res) => { const r = Engine.InsomniaCBTProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'InsomniaCBTProtocol', plan: r.plan }); });
router.post('/call/RestlessLegSyndrome', (req, res) => { const r = Engine.RestlessLegSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'RestlessLegSyndrome', plan: r.plan }); });
router.post('/call/NarcolepsyDiagnosis', (req, res) => { const r = Engine.NarcolepsyDiagnosis(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'NarcolepsyDiagnosis', plan: r.plan }); });
router.post('/call/CircadianRhythmDisorder', (req, res) => { const r = Engine.CircadianRhythmDisorder(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'CircadianRhythmDisorder', plan: r.plan }); });
router.post('/call/ParasomniaEvaluation', (req, res) => { const r = Engine.ParasomniaEvaluation(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'ParasomniaEvaluation', plan: r.plan }); });
router.post('/call/SleepHygieneEducation', (req, res) => { const r = Engine.SleepHygieneEducation(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'SleepHygieneEducation', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_sleep_clinic', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
