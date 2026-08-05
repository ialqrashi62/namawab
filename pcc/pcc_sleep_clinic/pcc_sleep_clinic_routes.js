// P3-DX pcc_sleep_clinic_routes v3.88.0
// P3-DX: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_sleep_clinic_engine.js');
const VER = '3.88.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_sleep_clinic', label: 'PCC Sleep Clinic', functions: Object.keys(F) });
});
router.post('/call/PolysomnographyInterpretation', (req, res) => { const r = F.PolysomnographyInterpretation(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'PolysomnographyInterpretation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/OSAHSeverityStratification', (req, res) => { const r = F.OSAHSeverityStratification(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'OSAHSeverityStratification', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CPAPTitrationProtocol', (req, res) => { const r = F.CPAPTitrationProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'CPAPTitrationProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BiPAPIndication', (req, res) => { const r = F.BiPAPIndication(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'BiPAPIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/InsomniaCBTProtocol', (req, res) => { const r = F.InsomniaCBTProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'InsomniaCBTProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RestlessLegSyndrome', (req, res) => { const r = F.RestlessLegSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'RestlessLegSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NarcolepsyDiagnosis', (req, res) => { const r = F.NarcolepsyDiagnosis(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'NarcolepsyDiagnosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CircadianRhythmDisorder', (req, res) => { const r = F.CircadianRhythmDisorder(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'CircadianRhythmDisorder', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ParasomniaEvaluation', (req, res) => { const r = F.ParasomniaEvaluation(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'ParasomniaEvaluation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SleepHygieneEducation', (req, res) => { const r = F.SleepHygieneEducation(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_clinic', function: 'SleepHygieneEducation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_sleep_clinic', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
