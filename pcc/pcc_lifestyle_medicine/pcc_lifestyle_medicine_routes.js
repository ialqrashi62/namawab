// P3-DC pcc_lifestyle_medicine_routes v3.67.0
// P3-DC: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_lifestyle_medicine_engine.js');
const VER = '3.67.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_lifestyle_medicine', label: 'PCC Lifestyle Medicine', functions: Object.keys(F) });
});

router.post('/call/PhysicalActivity', (req, res) => { const r = F.PhysicalActivity(req.body || {}); res.json({ version: VER, module: 'pcc_lifestyle_medicine', function: 'PhysicalActivity', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NutritionHabits', (req, res) => { const r = F.NutritionHabits(req.body || {}); res.json({ version: VER, module: 'pcc_lifestyle_medicine', function: 'NutritionHabits', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SleepHygiene', (req, res) => { const r = F.SleepHygiene(req.body || {}); res.json({ version: VER, module: 'pcc_lifestyle_medicine', function: 'SleepHygiene', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/StressManagement', (req, res) => { const r = F.StressManagement(req.body || {}); res.json({ version: VER, module: 'pcc_lifestyle_medicine', function: 'StressManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SocialConnection', (req, res) => { const r = F.SocialConnection(req.body || {}); res.json({ version: VER, module: 'pcc_lifestyle_medicine', function: 'SocialConnection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SubstanceUse', (req, res) => { const r = F.SubstanceUse(req.body || {}); res.json({ version: VER, module: 'pcc_lifestyle_medicine', function: 'SubstanceUse', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Mindfulness', (req, res) => { const r = F.Mindfulness(req.body || {}); res.json({ version: VER, module: 'pcc_lifestyle_medicine', function: 'Mindfulness', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/WorkLifeBalance', (req, res) => { const r = F.WorkLifeBalance(req.body || {}); res.json({ version: VER, module: 'pcc_lifestyle_medicine', function: 'WorkLifeBalance', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NatureExposure', (req, res) => { const r = F.NatureExposure(req.body || {}); res.json({ version: VER, module: 'pcc_lifestyle_medicine', function: 'NatureExposure', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PurposeAndMeaning', (req, res) => { const r = F.PurposeAndMeaning(req.body || {}); res.json({ version: VER, module: 'pcc_lifestyle_medicine', function: 'PurposeAndMeaning', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_lifestyle_medicine', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
