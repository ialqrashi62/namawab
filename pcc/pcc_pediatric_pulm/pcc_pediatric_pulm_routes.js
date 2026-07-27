// P3-EG pcc_pediatric_pulm_routes v3.97.0
// P3-EG: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_pulm_engine.js');
const VER = '3.97.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_pulm', label: 'PCC Pediatric Pulm', functions: Object.keys(Engine) });
});
router.post('/call/PediatricAsthmaManagement', (req, res) => { const r = Engine.PediatricAsthmaManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'PediatricAsthmaManagement', plan: r.plan }); });
router.post('/call/PediatricCysticFibrosis', (req, res) => { const r = Engine.PediatricCysticFibrosis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'PediatricCysticFibrosis', plan: r.plan }); });
router.post('/call/BronchiolitisManagement', (req, res) => { const r = Engine.BronchiolitisManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'BronchiolitisManagement', plan: r.plan }); });
router.post('/call/PediatricPneumonia', (req, res) => { const r = Engine.PediatricPneumonia(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'PediatricPneumonia', plan: r.plan }); });
router.post('/call/PediatricTuberculosis', (req, res) => { const r = Engine.PediatricTuberculosis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'PediatricTuberculosis', plan: r.plan }); });
router.post('/call/PediatricSleepApnea', (req, res) => { const r = Engine.PediatricSleepApnea(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'PediatricSleepApnea', plan: r.plan }); });
router.post('/call/PediatricChronicLungDisease', (req, res) => { const r = Engine.PediatricChronicLungDisease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'PediatricChronicLungDisease', plan: r.plan }); });
router.post('/call/PediatricVentilationSupport', (req, res) => { const r = Engine.PediatricVentilationSupport(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'PediatricVentilationSupport', plan: r.plan }); });
router.post('/call/PediatricAirwayAnomalies', (req, res) => { const r = Engine.PediatricAirwayAnomalies(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'PediatricAirwayAnomalies', plan: r.plan }); });
router.post('/call/PediatricPulmonaryHypertension', (req, res) => { const r = Engine.PediatricPulmonaryHypertension(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'PediatricPulmonaryHypertension', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_pulm', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
