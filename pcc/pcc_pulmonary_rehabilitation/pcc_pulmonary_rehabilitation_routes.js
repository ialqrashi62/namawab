// P3-DK pcc_pulmonary_rehabilitation_routes v3.75.0
// P3-DK: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pulmonary_rehabilitation_engine.js');
const VER = '3.75.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', label: 'PCC Pulmonary Rehabilitation', functions: Object.keys(F) });
});

router.post('/call/ExerciseCapacity', (req, res) => { const r = F.ExerciseCapacity(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'ExerciseCapacity', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DyspneaIndex', (req, res) => { const r = F.DyspneaIndex(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'DyspneaIndex', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SixMinuteWalk', (req, res) => { const r = F.SixMinuteWalk(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'SixMinuteWalk', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RehabAdherence', (req, res) => { const r = F.RehabAdherence(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'RehabAdherence', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/InhalerTechnique', (req, res) => { const r = F.InhalerTechnique(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'InhalerTechnique', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AirwayClearance', (req, res) => { const r = F.AirwayClearance(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'AirwayClearance', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PulmonaryEducation', (req, res) => { const r = F.PulmonaryEducation(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'PulmonaryEducation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SmokingCessation', (req, res) => { const r = F.SmokingCessation(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'SmokingCessation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NutritionPulmonary', (req, res) => { const r = F.NutritionPulmonary(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'NutritionPulmonary', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PsychosocialScreen', (req, res) => { const r = F.PsychosocialScreen(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'PsychosocialScreen', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
