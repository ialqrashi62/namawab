// P3-DH pcc_mental_resilience_routes v3.72.0
// P3-DH: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_mental_resilience_engine.js');
const VER = '3.72.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_mental_resilience', label: 'PCC Mental Resilience', functions: Object.keys(F) });
});

router.post('/call/StressInoculation', (req, res) => { const r = F.StressInoculation(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'StressInoculation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/EmotionRegulation', (req, res) => { const r = F.EmotionRegulation(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'EmotionRegulation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GritScale', (req, res) => { const r = F.GritScale(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'GritScale', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BurnoutRecovery', (req, res) => { const r = F.BurnoutRecovery(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'BurnoutRecovery', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TraumaResilience', (req, res) => { const r = F.TraumaResilience(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'TraumaResilience', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MindfulnessResilience', (req, res) => { const r = F.MindfulnessResilience(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'MindfulnessResilience', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SocialSupport', (req, res) => { const r = F.SocialSupport(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'SocialSupport', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PurposeResilience', (req, res) => { const r = F.PurposeResilience(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'PurposeResilience', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Adaptability', (req, res) => { const r = F.Adaptability(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'Adaptability', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RecoveryPlan', (req, res) => { const r = F.RecoveryPlan(req.body || {}); res.json({ version: VER, module: 'pcc_mental_resilience', function: 'RecoveryPlan', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_mental_resilience', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
