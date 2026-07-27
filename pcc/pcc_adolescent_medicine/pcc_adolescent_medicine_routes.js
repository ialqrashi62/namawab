// P3-EE pcc_adolescent_medicine_routes v3.95.0
// P3-EE: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_adolescent_medicine_engine.js');
const VER = '3.95.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_adolescent_medicine', label: 'PCC Adolescent Medicine', functions: Object.keys(Engine) });
});
router.post('/call/EatingDisorderAssessment', (req, res) => { const r = Engine.EatingDisorderAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'EatingDisorderAssessment', plan: r.plan }); });
router.post('/call/AdolescentDepressionScreen', (req, res) => { const r = Engine.AdolescentDepressionScreen(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'AdolescentDepressionScreen', plan: r.plan }); });
router.post('/call/PubertyDisorders', (req, res) => { const r = Engine.PubertyDisorders(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'PubertyDisorders', plan: r.plan }); });
router.post('/call/AdolescentSubstanceUse', (req, res) => { const r = Engine.AdolescentSubstanceUse(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'AdolescentSubstanceUse', plan: r.plan }); });
router.post('/call/AdolescentSexualHealth', (req, res) => { const r = Engine.AdolescentSexualHealth(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'AdolescentSexualHealth', plan: r.plan }); });
router.post('/call/AdolescentImmunizations', (req, res) => { const r = Engine.AdolescentImmunizations(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'AdolescentImmunizations', plan: r.plan }); });
router.post('/call/AdolescentObesity', (req, res) => { const r = Engine.AdolescentObesity(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'AdolescentObesity', plan: r.plan }); });
router.post('/call/AdolescentRiskBehavior', (req, res) => { const r = Engine.AdolescentRiskBehavior(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'AdolescentRiskBehavior', plan: r.plan }); });
router.post('/call/TransitionToAdultCare', (req, res) => { const r = Engine.TransitionToAdultCare(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'TransitionToAdultCare', plan: r.plan }); });
router.post('/call/AdolescentGynecology', (req, res) => { const r = Engine.AdolescentGynecology(req.body || {}); res.json({ version: VER, module: 'pcc_adolescent_medicine', function: 'AdolescentGynecology', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_adolescent_medicine', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
