// P3-DK pcc_respiratory_therapy_routes v3.75.0
// P3-DK: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_respiratory_therapy_engine.js');
const VER = '3.75.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_respiratory_therapy', label: 'PCC Respiratory Therapy', functions: Object.keys(Engine) });
});

router.post('/call/AerosolTherapy', (req, res) => { const r = Engine.AerosolTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_respiratory_therapy', function: 'AerosolTherapy', plan: r.plan }); });
router.post('/call/MechanicalVentilationWean', (req, res) => { const r = Engine.MechanicalVentilationWean(req.body || {}); res.json({ version: VER, module: 'pcc_respiratory_therapy', function: 'MechanicalVentilationWean', plan: r.plan }); });
router.post('/call/NonInvasiveVentilation', (req, res) => { const r = Engine.NonInvasiveVentilation(req.body || {}); res.json({ version: VER, module: 'pcc_respiratory_therapy', function: 'NonInvasiveVentilation', plan: r.plan }); });
router.post('/call/HighFlowNasalCannula', (req, res) => { const r = Engine.HighFlowNasalCannula(req.body || {}); res.json({ version: VER, module: 'pcc_respiratory_therapy', function: 'HighFlowNasalCannula', plan: r.plan }); });
router.post('/call/ArterialBloodGasInterpret', (req, res) => { const r = Engine.ArterialBloodGasInterpret(req.body || {}); res.json({ version: VER, module: 'pcc_respiratory_therapy', function: 'ArterialBloodGasInterpret', plan: r.plan }); });
router.post('/call/BronchoscopyPrep', (req, res) => { const r = Engine.BronchoscopyPrep(req.body || {}); res.json({ version: VER, module: 'pcc_respiratory_therapy', function: 'BronchoscopyPrep', plan: r.plan }); });
router.post('/call/SputumInduction', (req, res) => { const r = Engine.SputumInduction(req.body || {}); res.json({ version: VER, module: 'pcc_respiratory_therapy', function: 'SputumInduction', plan: r.plan }); });
router.post('/call/PulmonaryFunctionTestPrep', (req, res) => { const r = Engine.PulmonaryFunctionTestPrep(req.body || {}); res.json({ version: VER, module: 'pcc_respiratory_therapy', function: 'PulmonaryFunctionTestPrep', plan: r.plan }); });
router.post('/call/OxygenConservingDevice', (req, res) => { const r = Engine.OxygenConservingDevice(req.body || {}); res.json({ version: VER, module: 'pcc_respiratory_therapy', function: 'OxygenConservingDevice', plan: r.plan }); });
router.post('/call/RespiratoryEmergencyBag', (req, res) => { const r = Engine.RespiratoryEmergencyBag(req.body || {}); res.json({ version: VER, module: 'pcc_respiratory_therapy', function: 'RespiratoryEmergencyBag', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_respiratory_therapy', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
