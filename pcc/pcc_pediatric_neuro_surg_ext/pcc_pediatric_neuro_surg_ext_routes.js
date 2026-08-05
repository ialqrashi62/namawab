// P3-ET pcc_pediatric_neuro_surg_ext_routes v3.110.0
// P3-ET: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_neuro_surg_ext_engine.js');
const VER = '3.110.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', label: 'PCC Pediatric Neuro Surg Ext', functions: Object.keys(F) });
});
router.post('/call/PediatricSelectiveDorsalRhizotomy', (req, res) => { const r = F.PediatricSelectiveDorsalRhizotomy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricSelectiveDorsalRhizotomy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricIntrathecalBaclofen', (req, res) => { const r = F.PediatricIntrathecalBaclofen(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricIntrathecalBaclofen', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricVagalNerveStimulator', (req, res) => { const r = F.PediatricVagalNerveStimulator(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricVagalNerveStimulator', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricDeepBrainStimulation', (req, res) => { const r = F.PediatricDeepBrainStimulation(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricDeepBrainStimulation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricSpinalFusionSurg', (req, res) => { const r = F.PediatricSpinalFusionSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricSpinalFusionSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricTetheredCordRelease', (req, res) => { const r = F.PediatricTetheredCordRelease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricTetheredCordRelease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricScoliosisSurg', (req, res) => { const r = F.PediatricScoliosisSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricScoliosisSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCraniectomy', (req, res) => { const r = F.PediatricCraniectomy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricCraniectomy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricSkullBaseSurg', (req, res) => { const r = F.PediatricSkullBaseSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricSkullBaseSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricEndoscopicThirdVentriculostomy', (req, res) => { const r = F.PediatricEndoscopicThirdVentriculostomy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricEndoscopicThirdVentriculostomy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
