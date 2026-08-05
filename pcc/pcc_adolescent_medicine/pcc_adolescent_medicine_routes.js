// P3-EE pcc_adolescent_medicine_routes v3.95.0
// P3-EE: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_adolescent_medicine_engine.js');
const VER = '3.95.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_adolescent_medicine', label: 'PCC Adolescent Medicine', functions: Object.keys(F) });
});
router.post('/call/EatingDisorderAssessment', (req, res) => { const r = F.EatingDisorderAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'EatingDisorderAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AdolescentDepressionScreen', (req, res) => { const r = F.AdolescentDepressionScreen(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'AdolescentDepressionScreen', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PubertyDisorders', (req, res) => { const r = F.PubertyDisorders(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'PubertyDisorders', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AdolescentSubstanceUse', (req, res) => { const r = F.AdolescentSubstanceUse(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'AdolescentSubstanceUse', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AdolescentSexualHealth', (req, res) => { const r = F.AdolescentSexualHealth(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'AdolescentSexualHealth', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AdolescentImmunizations', (req, res) => { const r = F.AdolescentImmunizations(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'AdolescentImmunizations', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AdolescentObesity', (req, res) => { const r = F.AdolescentObesity(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'AdolescentObesity', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AdolescentRiskBehavior', (req, res) => { const r = F.AdolescentRiskBehavior(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'AdolescentRiskBehavior', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TransitionToAdultCare', (req, res) => { const r = F.TransitionToAdultCare(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'TransitionToAdultCare', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AdolescentGynecology', (req, res) => { const r = F.AdolescentGynecology(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'AdolescentGynecology', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_adolescent_medicine', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
