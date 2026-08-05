// P3-DP pcc_immunology_advanced_routes v3.80.0
// P3-DP: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_immunology_advanced_engine.js');
const VER = '3.80.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_immunology_advanced', label: 'PCC Immunology Advanced', functions: Object.keys(F) });
});

router.post('/call/PrimaryImmunodeficiency', (req, res) => { const r = F.PrimaryImmunodeficiency(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'PrimaryImmunodeficiency', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SecondaryImmunodeficiency', (req, res) => { const r = F.SecondaryImmunodeficiency(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'SecondaryImmunodeficiency', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AutoimmuneLymphoproliferative', (req, res) => { const r = F.AutoimmuneLymphoproliferative(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'AutoimmuneLymphoproliferative', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ImmuneReconstitution', (req, res) => { const r = F.ImmuneReconstitution(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'ImmuneReconstitution', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CytokineStorm', (req, res) => { const r = F.CytokineStorm(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'CytokineStorm', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HypersensitivityPneumonitis', (req, res) => { const r = F.HypersensitivityPneumonitis(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'HypersensitivityPneumonitis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ImmuneCheckpointToxicity', (req, res) => { const r = F.ImmuneCheckpointToxicity(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'ImmuneCheckpointToxicity', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TransplantRejectionImmune', (req, res) => { const r = F.TransplantRejectionImmune(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'TransplantRejectionImmune', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VaccineResponseAssessment', (req, res) => { const r = F.VaccineResponseAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'VaccineResponseAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BiologicMonitoring', (req, res) => { const r = F.BiologicMonitoring(req.body || {}); res.json({ version: VER, module: 'pcc_immunology_advanced', function: 'BiologicMonitoring', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_immunology_advanced', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
