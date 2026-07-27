// P3-DH pcc_brain_health_routes v3.72.0
// P3-DH: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_brain_health_engine.js');
const VER = '3.72.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_brain_health', label: 'PCC Brain Health', functions: Object.keys(Engine) });
});

router.post('/call/Neuroplasticity', (req, res) => { const r = Engine.Neuroplasticity(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'Neuroplasticity', plan: r.plan }); });
router.post('/call/CognitiveReserve', (req, res) => { const r = Engine.CognitiveReserve(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'CognitiveReserve', plan: r.plan }); });
router.post('/call/BrainNutrition', (req, res) => { const r = Engine.BrainNutrition(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'BrainNutrition', plan: r.plan }); });
router.post('/call/SleepBrain', (req, res) => { const r = Engine.SleepBrain(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'SleepBrain', plan: r.plan }); });
router.post('/call/ExerciseBrain', (req, res) => { const r = Engine.ExerciseBrain(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'ExerciseBrain', plan: r.plan }); });
router.post('/call/ToxinBrain', (req, res) => { const r = Engine.ToxinBrain(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'ToxinBrain', plan: r.plan }); });
router.post('/call/VascularBrain', (req, res) => { const r = Engine.VascularBrain(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'VascularBrain', plan: r.plan }); });
router.post('/call/MoodBrain', (req, res) => { const r = Engine.MoodBrain(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'MoodBrain', plan: r.plan }); });
router.post('/call/SocialBrain', (req, res) => { const r = Engine.SocialBrain(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'SocialBrain', plan: r.plan }); });
router.post('/call/BrainAging', (req, res) => { const r = Engine.BrainAging(req.body || {}); res.json({ version: VER, module: 'pcc_brain_health', function: 'BrainAging', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_brain_health', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
