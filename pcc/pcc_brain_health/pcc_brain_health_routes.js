// P3-DH pcc_brain_health_routes v3.72.0
// P3-DH: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_brain_health_engine.js');
const VER = '3.72.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_brain_health', label: 'PCC Brain Health', functions: Object.keys(F) });
});

router.post('/call/Neuroplasticity', (req, res) => { const r = F.Neuroplasticity(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'Neuroplasticity', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CognitiveReserve', (req, res) => { const r = F.CognitiveReserve(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'CognitiveReserve', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BrainNutrition', (req, res) => { const r = F.BrainNutrition(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'BrainNutrition', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SleepBrain', (req, res) => { const r = F.SleepBrain(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'SleepBrain', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ExerciseBrain', (req, res) => { const r = F.ExerciseBrain(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'ExerciseBrain', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ToxinBrain', (req, res) => { const r = F.ToxinBrain(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'ToxinBrain', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VascularBrain', (req, res) => { const r = F.VascularBrain(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'VascularBrain', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MoodBrain', (req, res) => { const r = F.MoodBrain(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'MoodBrain', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SocialBrain', (req, res) => { const r = F.SocialBrain(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'SocialBrain', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BrainAging', (req, res) => { const r = F.BrainAging(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'BrainAging', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_brain_health', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
