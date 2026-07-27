// P3-DC pcc_space_medicine_routes v3.67.0
// P3-DC: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_space_medicine_engine.js');
const VER = '3.67.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_space_medicine', label: 'PCC Space Medicine', functions: Object.keys(Engine) });
});

router.post('/call/MicrogravityPhysiology', (req, res) => { const r = Engine.MicrogravityPhysiology(req.body || {}); res.json({ version: VER, module: 'pcc_space_medicine', function: 'MicrogravityPhysiology', plan: r.plan }); });
router.post('/call/RadiationProtection', (req, res) => { const r = Engine.RadiationProtection(req.body || {}); res.json({ version: VER, module: 'pcc_space_medicine', function: 'RadiationProtection', plan: r.plan }); });
router.post('/call/IsolationPsychology', (req, res) => { const r = Engine.IsolationPsychology(req.body || {}); res.json({ version: VER, module: 'pcc_space_medicine', function: 'IsolationPsychology', plan: r.plan }); });
router.post('/call/EVAMedical', (req, res) => { const r = Engine.EVAMedical(req.body || {}); res.json({ version: VER, module: 'pcc_space_medicine', function: 'EVAMedical', plan: r.plan }); });
router.post('/call/Countermeasures', (req, res) => { const r = Engine.Countermeasures(req.body || {}); res.json({ version: VER, module: 'pcc_space_medicine', function: 'Countermeasures', plan: r.plan }); });
router.post('/call/SpaceNutrition', (req, res) => { const r = Engine.SpaceNutrition(req.body || {}); res.json({ version: VER, module: 'pcc_space_medicine', function: 'SpaceNutrition', plan: r.plan }); });
router.post('/call/TelemedicineSpace', (req, res) => { const r = Engine.TelemedicineSpace(req.body || {}); res.json({ version: VER, module: 'pcc_space_medicine', function: 'TelemedicineSpace', plan: r.plan }); });
router.post('/call/ReentryCare', (req, res) => { const r = Engine.ReentryCare(req.body || {}); res.json({ version: VER, module: 'pcc_space_medicine', function: 'ReentryCare', plan: r.plan }); });
router.post('/call/AstronautSelection', (req, res) => { const r = Engine.AstronautSelection(req.body || {}); res.json({ version: VER, module: 'pcc_space_medicine', function: 'AstronautSelection', plan: r.plan }); });
router.post('/call/LongDurationHealth', (req, res) => { const r = Engine.LongDurationHealth(req.body || {}); res.json({ version: VER, module: 'pcc_space_medicine', function: 'LongDurationHealth', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_space_medicine', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
