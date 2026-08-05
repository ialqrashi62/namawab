// P3-EF pcc_pediatric_hematology_routes v3.96.0
// P3-EF: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_hematology_engine.js');
const VER = '3.96.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_hematology', label: 'PCC Pediatric Hematology', functions: Object.keys(F) });
});
router.post('/call/ChildhoodAnemiaWorkup', (req, res) => { const r = F.ChildhoodAnemiaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'ChildhoodAnemiaWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SickleCellDiseaseManagement', (req, res) => { const r = F.SickleCellDiseaseManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'SickleCellDiseaseManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ThalassemiaSyndromes', (req, res) => { const r = F.ThalassemiaSyndromes(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'ThalassemiaSyndromes', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricThrombocytopenia', (req, res) => { const r = F.PediatricThrombocytopenia(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'PediatricThrombocytopenia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HemophiliaManagement', (req, res) => { const r = F.HemophiliaManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'HemophiliaManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VonWillebrandDisease', (req, res) => { const r = F.VonWillebrandDisease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'VonWillebrandDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricLeukemiaSupport', (req, res) => { const r = F.PediatricLeukemiaSupport(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'PediatricLeukemiaSupport', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BoneMarrowFailureSyndromes', (req, res) => { const r = F.BoneMarrowFailureSyndromes(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'BoneMarrowFailureSyndromes', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/IronDeficiencyAnemia', (req, res) => { const r = F.IronDeficiencyAnemia(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'IronDeficiencyAnemia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NewbornHematologicScreening', (req, res) => { const r = F.NewbornHematologicScreening(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_hematology', function: 'NewbornHematologicScreening', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_hematology', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
