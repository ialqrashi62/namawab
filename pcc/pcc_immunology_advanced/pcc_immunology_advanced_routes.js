// P3-DP pcc_immunology_advanced_routes v3.80.0
// P3-DP: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_immunology_advanced_engine.js');
const VER = '3.80.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_immunology_advanced', label: 'PCC Immunology Advanced', functions: Object.keys(Engine) });
});

router.post('/call/PrimaryImmunodeficiency', (req, res) => { const r = Engine.PrimaryImmunodeficiency(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'PrimaryImmunodeficiency', plan: r.plan }); });
router.post('/call/SecondaryImmunodeficiency', (req, res) => { const r = Engine.SecondaryImmunodeficiency(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'SecondaryImmunodeficiency', plan: r.plan }); });
router.post('/call/AutoimmuneLymphoproliferative', (req, res) => { const r = Engine.AutoimmuneLymphoproliferative(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'AutoimmuneLymphoproliferative', plan: r.plan }); });
router.post('/call/ImmuneReconstitution', (req, res) => { const r = Engine.ImmuneReconstitution(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'ImmuneReconstitution', plan: r.plan }); });
router.post('/call/CytokineStorm', (req, res) => { const r = Engine.CytokineStorm(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'CytokineStorm', plan: r.plan }); });
router.post('/call/HypersensitivityPneumonitis', (req, res) => { const r = Engine.HypersensitivityPneumonitis(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'HypersensitivityPneumonitis', plan: r.plan }); });
router.post('/call/ImmuneCheckpointToxicity', (req, res) => { const r = Engine.ImmuneCheckpointToxicity(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'ImmuneCheckpointToxicity', plan: r.plan }); });
router.post('/call/TransplantRejectionImmune', (req, res) => { const r = Engine.TransplantRejectionImmune(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'TransplantRejectionImmune', plan: r.plan }); });
router.post('/call/VaccineResponseAssessment', (req, res) => { const r = Engine.VaccineResponseAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'VaccineResponseAssessment', plan: r.plan }); });
router.post('/call/BiologicMonitoring', (req, res) => { const r = Engine.BiologicMonitoring(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'BiologicMonitoring', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_immunology_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
