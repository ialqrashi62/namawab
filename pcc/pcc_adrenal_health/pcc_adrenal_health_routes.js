// P3-DG pcc_adrenal_health_routes v3.71.0
// P3-DG: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_adrenal_health_engine.js');
const VER = '3.71.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_adrenal_health', label: 'PCC Adrenal Health', functions: Object.keys(F) });
});

router.post('/call/CortisolCurve', (req, res) => { const r = F.CortisolCurve(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'CortisolCurve', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DHEASLevel', (req, res) => { const r = F.DHEASLevel(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'DHEASLevel', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AdrenalFatigue', (req, res) => { const r = F.AdrenalFatigue(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'AdrenalFatigue', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/StressResponse', (req, res) => { const r = F.StressResponse(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'StressResponse', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HPAAxis', (req, res) => { const r = F.HPAAxis(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'HPAAxis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AldosteroneBalance', (req, res) => { const r = F.AldosteroneBalance(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'AldosteroneBalance', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SaltCraving', (req, res) => { const r = F.SaltCraving(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'SaltCraving', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MorningCortisol', (req, res) => { const r = F.MorningCortisol(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'MorningCortisol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ACTHStimulation', (req, res) => { const r = F.ACTHStimulation(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'ACTHStimulation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AdrenalCrisis', (req, res) => { const r = F.AdrenalCrisis(req.body || {}); res.json({ version: VER, module: 'pcc_adrenal_health', function: 'AdrenalCrisis', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_adrenal_health', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
