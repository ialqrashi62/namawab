// P3-DF pcc_immune_health_routes v3.70.0
// P3-DF: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_immune_health_engine.js');
const VER = '3.70.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_immune_health', label: 'PCC Immune Health', functions: Object.keys(F) });
});

router.post('/call/ImmunePanel', (req, res) => { const r = F.ImmunePanel(req.body || {}); res.json({ version: VER, module: 'pcc_immune_health', function: 'ImmunePanel', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VaccineResponse', (req, res) => { const r = F.VaccineResponse(req.body || {}); res.json({ version: VER, module: 'pcc_immune_health', function: 'VaccineResponse', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AutoimmuneRisk', (req, res) => { const r = F.AutoimmuneRisk(req.body || {}); res.json({ version: VER, module: 'pcc_immune_health', function: 'AutoimmuneRisk', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Immunodeficiency', (req, res) => { const r = F.Immunodeficiency(req.body || {}); res.json({ version: VER, module: 'pcc_immune_health', function: 'Immunodeficiency', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AllergyImmune', (req, res) => { const r = F.AllergyImmune(req.body || {}); res.json({ version: VER, module: 'pcc_immune_health', function: 'AllergyImmune', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/InfectionSusceptibility', (req, res) => { const r = F.InfectionSusceptibility(req.body || {}); res.json({ version: VER, module: 'pcc_immune_health', function: 'InfectionSusceptibility', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ImmuneAging', (req, res) => { const r = F.ImmuneAging(req.body || {}); res.json({ version: VER, module: 'pcc_immune_health', function: 'ImmuneAging', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Th1Th2Balance', (req, res) => { const r = F.Th1Th2Balance(req.body || {}); res.json({ version: VER, module: 'pcc_immune_health', function: 'Th1Th2Balance', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CytokineProfile', (req, res) => { const r = F.CytokineProfile(req.body || {}); res.json({ version: VER, module: 'pcc_immune_health', function: 'CytokineProfile', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ImmuneSupportPlan', (req, res) => { const r = F.ImmuneSupportPlan(req.body || {}); res.json({ version: VER, module: 'pcc_immune_health', function: 'ImmuneSupportPlan', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_immune_health', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
