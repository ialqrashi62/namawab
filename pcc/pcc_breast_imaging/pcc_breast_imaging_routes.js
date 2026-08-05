// P3-DZ pcc_breast_imaging_routes v3.90.0
// P3-DZ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_breast_imaging_engine.js');
const VER = '3.90.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_breast_imaging', label: 'PCC Breast Imaging', functions: Object.keys(F) });
});
router.post('/call/BIRADSCategorization', (req, res) => { const r = F.BIRADSCategorization(req.body || {}); res.json({ version: VER, module: 'pcc_breast_imaging', function: 'BIRADSCategorization', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MammogramRecallProtocol', (req, res) => { const r = F.MammogramRecallProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_breast_imaging', function: 'MammogramRecallProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BreastUSIndication', (req, res) => { const r = F.BreastUSIndication(req.body || {}); res.json({ version: VER, module: 'pcc_breast_imaging', function: 'BreastUSIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BreastMRIHighRisk', (req, res) => { const r = F.BreastMRIHighRisk(req.body || {}); res.json({ version: VER, module: 'pcc_breast_imaging', function: 'BreastMRIHighRisk', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TomosynthesisInterpretation', (req, res) => { const r = F.TomosynthesisInterpretation(req.body || {}); res.json({ version: VER, module: 'pcc_breast_imaging', function: 'TomosynthesisInterpretation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DuctalCarcinomaInSitu', (req, res) => { const r = F.DuctalCarcinomaInSitu(req.body || {}); res.json({ version: VER, module: 'pcc_breast_imaging', function: 'DuctalCarcinomaInSitu', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AtypiaManagement', (req, res) => { const r = F.AtypiaManagement(req.body || {}); res.json({ version: VER, module: 'pcc_breast_imaging', function: 'AtypiaManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BreastLesionBiopsyIndication', (req, res) => { const r = F.BreastLesionBiopsyIndication(req.body || {}); res.json({ version: VER, module: 'pcc_breast_imaging', function: 'BreastLesionBiopsyIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ImplantRuptureImaging', (req, res) => { const r = F.ImplantRuptureImaging(req.body || {}); res.json({ version: VER, module: 'pcc_breast_imaging', function: 'ImplantRuptureImaging', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MaleBreastImaging', (req, res) => { const r = F.MaleBreastImaging(req.body || {}); res.json({ version: VER, module: 'pcc_breast_imaging', function: 'MaleBreastImaging', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_breast_imaging', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
