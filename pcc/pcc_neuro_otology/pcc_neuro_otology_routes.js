// P3-ED pcc_neuro_otology_routes v3.94.0
// P3-ED: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neuro_otology_engine.js');
const VER = '3.94.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_otology', label: 'PCC Neuro Otology', functions: Object.keys(F) });
});
router.post('/call/VestibularMigraineAssessment', (req, res) => { const r = F.VestibularMigraineAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_otology', function: 'VestibularMigraineAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MeniereDiseaseManagement', (req, res) => { const r = F.MeniereDiseaseManagement(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_otology', function: 'MeniereDiseaseManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BPPVCanalithRepositioning', (req, res) => { const r = F.BPPVCanalithRepositioning(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_otology', function: 'BPPVCanalithRepositioning', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AcousticNeuromaScreening', (req, res) => { const r = F.AcousticNeuromaScreening(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_otology', function: 'AcousticNeuromaScreening', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SuddenHearingLossProtocol', (req, res) => { const r = F.SuddenHearingLossProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_otology', function: 'SuddenHearingLossProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TinnitusAssessment', (req, res) => { const r = F.TinnitusAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_otology', function: 'TinnitusAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/OtotoxicityMonitoring', (req, res) => { const r = F.OtotoxicityMonitoring(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_otology', function: 'OtotoxicityMonitoring', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CochlearImplantCandidacy', (req, res) => { const r = F.CochlearImplantCandidacy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_otology', function: 'CochlearImplantCandidacy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SuperiorCanalDehiscence', (req, res) => { const r = F.SuperiorCanalDehiscence(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_otology', function: 'SuperiorCanalDehiscence', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AutoimmuneInnerEarDisease', (req, res) => { const r = F.AutoimmuneInnerEarDisease(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_otology', function: 'AutoimmuneInnerEarDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_otology', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
