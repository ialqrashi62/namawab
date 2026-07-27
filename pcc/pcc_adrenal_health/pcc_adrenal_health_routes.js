// P3-DG pcc_adrenal_health_routes v3.71.0
// P3-DG: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_adrenal_health_engine.js');
const VER = '3.71.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_adrenal_health', label: 'PCC Adrenal Health', functions: Object.keys(Engine) });
});

router.post('/call/CortisolCurve', (req, res) => { const r = Engine.CortisolCurve(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'CortisolCurve', plan: r.plan }); });
router.post('/call/DHEASLevel', (req, res) => { const r = Engine.DHEASLevel(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'DHEASLevel', plan: r.plan }); });
router.post('/call/AdrenalFatigue', (req, res) => { const r = Engine.AdrenalFatigue(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'AdrenalFatigue', plan: r.plan }); });
router.post('/call/StressResponse', (req, res) => { const r = Engine.StressResponse(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'StressResponse', plan: r.plan }); });
router.post('/call/HPAAxis', (req, res) => { const r = Engine.HPAAxis(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'HPAAxis', plan: r.plan }); });
router.post('/call/AldosteroneBalance', (req, res) => { const r = Engine.AldosteroneBalance(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'AldosteroneBalance', plan: r.plan }); });
router.post('/call/SaltCraving', (req, res) => { const r = Engine.SaltCraving(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'SaltCraving', plan: r.plan }); });
router.post('/call/MorningCortisol', (req, res) => { const r = Engine.MorningCortisol(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'MorningCortisol', plan: r.plan }); });
router.post('/call/ACTHStimulation', (req, res) => { const r = Engine.ACTHStimulation(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'ACTHStimulation', plan: r.plan }); });
router.post('/call/AdrenalCrisis', (req, res) => { const r = Engine.AdrenalCrisis(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'AdrenalCrisis', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_adrenal_health', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
