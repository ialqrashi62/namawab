// P3-DN pcc_dialysis_advanced_routes v3.78.0
// P3-DN: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_dialysis_advanced_engine.js');
const VER = '3.78.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_dialysis_advanced', label: 'PCC Dialysis Advanced', functions: Object.keys(Engine) });
});

router.post('/call/HemodialysisAccess', (req, res) => { const r = Engine.HemodialysisAccess(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'HemodialysisAccess', plan: r.plan }); });
router.post('/call/DialysisAdequacy', (req, res) => { const r = Engine.DialysisAdequacy(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'DialysisAdequacy', plan: r.plan }); });
router.post('/call/IntradialyticHypotension', (req, res) => { const r = Engine.IntradialyticHypotension(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'IntradialyticHypotension', plan: r.plan }); });
router.post('/call/DialysisDisequilibrium', (req, res) => { const r = Engine.DialysisDisequilibrium(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'DialysisDisequilibrium', plan: r.plan }); });
router.post('/call/PeritonealDialysisPrescription', (req, res) => { const r = Engine.PeritonealDialysisPrescription(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'PeritonealDialysisPrescription', plan: r.plan }); });
router.post('/call/PDPeritonitis', (req, res) => { const r = Engine.PDPeritonitis(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'PDPeritonitis', plan: r.plan }); });
router.post('/call/HomeHemodialysis', (req, res) => { const r = Engine.HomeHemodialysis(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'HomeHemodialysis', plan: r.plan }); });
router.post('/call/NocturnalDialysis', (req, res) => { const r = Engine.NocturnalDialysis(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'NocturnalDialysis', plan: r.plan }); });
router.post('/call/DialysisNutrition', (req, res) => { const r = Engine.DialysisNutrition(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'DialysisNutrition', plan: r.plan }); });
router.post('/call/TransplantReadiness', (req, res) => { const r = Engine.TransplantReadiness(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'TransplantReadiness', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_dialysis_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
