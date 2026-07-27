// P3-DK pcc_pulmonary_rehabilitation_routes v3.75.0
// P3-DK: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pulmonary_rehabilitation_engine.js');
const VER = '3.75.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', label: 'PCC Pulmonary Rehabilitation', functions: Object.keys(Engine) });
});

router.post('/call/ExerciseCapacity', (req, res) => { const r = Engine.ExerciseCapacity(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'ExerciseCapacity', plan: r.plan }); });
router.post('/call/DyspneaIndex', (req, res) => { const r = Engine.DyspneaIndex(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'DyspneaIndex', plan: r.plan }); });
router.post('/call/SixMinuteWalk', (req, res) => { const r = Engine.SixMinuteWalk(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'SixMinuteWalk', plan: r.plan }); });
router.post('/call/RehabAdherence', (req, res) => { const r = Engine.RehabAdherence(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'RehabAdherence', plan: r.plan }); });
router.post('/call/InhalerTechnique', (req, res) => { const r = Engine.InhalerTechnique(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'InhalerTechnique', plan: r.plan }); });
router.post('/call/AirwayClearance', (req, res) => { const r = Engine.AirwayClearance(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'AirwayClearance', plan: r.plan }); });
router.post('/call/PulmonaryEducation', (req, res) => { const r = Engine.PulmonaryEducation(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'PulmonaryEducation', plan: r.plan }); });
router.post('/call/SmokingCessation', (req, res) => { const r = Engine.SmokingCessation(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'SmokingCessation', plan: r.plan }); });
router.post('/call/NutritionPulmonary', (req, res) => { const r = Engine.NutritionPulmonary(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'NutritionPulmonary', plan: r.plan }); });
router.post('/call/PsychosocialScreen', (req, res) => { const r = Engine.PsychosocialScreen(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: 'PsychosocialScreen', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pulmonary_rehabilitation', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
