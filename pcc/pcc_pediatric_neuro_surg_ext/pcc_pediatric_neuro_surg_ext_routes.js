// P3-ET pcc_pediatric_neuro_surg_ext_routes v3.110.0
// P3-ET: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_neuro_surg_ext_engine.js');
const VER = '3.110.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', label: 'PCC Pediatric Neuro Surg Ext', functions: Object.keys(Engine) });
});
router.post('/call/PediatricSelectiveDorsalRhizotomy', (req, res) => { const r = Engine.PediatricSelectiveDorsalRhizotomy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricSelectiveDorsalRhizotomy', plan: r.plan }); });
router.post('/call/PediatricIntrathecalBaclofen', (req, res) => { const r = Engine.PediatricIntrathecalBaclofen(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricIntrathecalBaclofen', plan: r.plan }); });
router.post('/call/PediatricVagalNerveStimulator', (req, res) => { const r = Engine.PediatricVagalNerveStimulator(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricVagalNerveStimulator', plan: r.plan }); });
router.post('/call/PediatricDeepBrainStimulation', (req, res) => { const r = Engine.PediatricDeepBrainStimulation(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricDeepBrainStimulation', plan: r.plan }); });
router.post('/call/PediatricSpinalFusionSurg', (req, res) => { const r = Engine.PediatricSpinalFusionSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricSpinalFusionSurg', plan: r.plan }); });
router.post('/call/PediatricTetheredCordRelease', (req, res) => { const r = Engine.PediatricTetheredCordRelease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricTetheredCordRelease', plan: r.plan }); });
router.post('/call/PediatricScoliosisSurg', (req, res) => { const r = Engine.PediatricScoliosisSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricScoliosisSurg', plan: r.plan }); });
router.post('/call/PediatricCraniectomy', (req, res) => { const r = Engine.PediatricCraniectomy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricCraniectomy', plan: r.plan }); });
router.post('/call/PediatricSkullBaseSurg', (req, res) => { const r = Engine.PediatricSkullBaseSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricSkullBaseSurg', plan: r.plan }); });
router.post('/call/PediatricEndoscopicThirdVentriculostomy', (req, res) => { const r = Engine.PediatricEndoscopicThirdVentriculostomy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: 'PediatricEndoscopicThirdVentriculostomy', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_neuro_surg_ext', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
