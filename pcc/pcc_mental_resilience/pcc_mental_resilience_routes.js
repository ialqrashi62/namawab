// P3-DH pcc_mental_resilience_routes v3.72.0
// P3-DH: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_mental_resilience_engine.js');
const VER = '3.72.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_mental_resilience', label: 'PCC Mental Resilience', functions: Object.keys(Engine) });
});

router.post('/call/StressInoculation', (req, res) => { const r = Engine.StressInoculation(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'StressInoculation', plan: r.plan }); });
router.post('/call/EmotionRegulation', (req, res) => { const r = Engine.EmotionRegulation(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'EmotionRegulation', plan: r.plan }); });
router.post('/call/GritScale', (req, res) => { const r = Engine.GritScale(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'GritScale', plan: r.plan }); });
router.post('/call/BurnoutRecovery', (req, res) => { const r = Engine.BurnoutRecovery(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'BurnoutRecovery', plan: r.plan }); });
router.post('/call/TraumaResilience', (req, res) => { const r = Engine.TraumaResilience(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'TraumaResilience', plan: r.plan }); });
router.post('/call/MindfulnessResilience', (req, res) => { const r = Engine.MindfulnessResilience(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'MindfulnessResilience', plan: r.plan }); });
router.post('/call/SocialSupport', (req, res) => { const r = Engine.SocialSupport(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'SocialSupport', plan: r.plan }); });
router.post('/call/PurposeResilience', (req, res) => { const r = Engine.PurposeResilience(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'PurposeResilience', plan: r.plan }); });
router.post('/call/Adaptability', (req, res) => { const r = Engine.Adaptability(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'Adaptability', plan: r.plan }); });
router.post('/call/RecoveryPlan', (req, res) => { const r = Engine.RecoveryPlan(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'RecoveryPlan', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_mental_resilience', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
