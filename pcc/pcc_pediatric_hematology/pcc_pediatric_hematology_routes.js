// P3-EF pcc_pediatric_hematology_routes v3.96.0
// P3-EF: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_hematology_engine.js');
const VER = '3.96.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_hematology', label: 'PCC Pediatric Hematology', functions: Object.keys(Engine) });
});
router.post('/call/ChildhoodAnemiaWorkup', (req, res) => { const r = Engine.ChildhoodAnemiaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'ChildhoodAnemiaWorkup', plan: r.plan }); });
router.post('/call/SickleCellDiseaseManagement', (req, res) => { const r = Engine.SickleCellDiseaseManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'SickleCellDiseaseManagement', plan: r.plan }); });
router.post('/call/ThalassemiaSyndromes', (req, res) => { const r = Engine.ThalassemiaSyndromes(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'ThalassemiaSyndromes', plan: r.plan }); });
router.post('/call/PediatricThrombocytopenia', (req, res) => { const r = Engine.PediatricThrombocytopenia(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'PediatricThrombocytopenia', plan: r.plan }); });
router.post('/call/HemophiliaManagement', (req, res) => { const r = Engine.HemophiliaManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'HemophiliaManagement', plan: r.plan }); });
router.post('/call/VonWillebrandDisease', (req, res) => { const r = Engine.VonWillebrandDisease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'VonWillebrandDisease', plan: r.plan }); });
router.post('/call/PediatricLeukemiaSupport', (req, res) => { const r = Engine.PediatricLeukemiaSupport(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'PediatricLeukemiaSupport', plan: r.plan }); });
router.post('/call/BoneMarrowFailureSyndromes', (req, res) => { const r = Engine.BoneMarrowFailureSyndromes(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'BoneMarrowFailureSyndromes', plan: r.plan }); });
router.post('/call/IronDeficiencyAnemia', (req, res) => { const r = Engine.IronDeficiencyAnemia(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'IronDeficiencyAnemia', plan: r.plan }); });
router.post('/call/NewbornHematologicScreening', (req, res) => { const r = Engine.NewbornHematologicScreening(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'NewbornHematologicScreening', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_hematology', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
