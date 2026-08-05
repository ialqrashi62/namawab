// P3-DN pcc_dialysis_advanced_routes v3.78.0
// P3-DN: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_dialysis_advanced_engine.js');
const VER = '3.78.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_dialysis_advanced', label: 'PCC Dialysis Advanced', functions: Object.keys(F) });
});

router.post('/call/HemodialysisAccess', (req, res) => { const r = F.HemodialysisAccess(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'HemodialysisAccess', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DialysisAdequacy', (req, res) => { const r = F.DialysisAdequacy(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'DialysisAdequacy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/IntradialyticHypotension', (req, res) => { const r = F.IntradialyticHypotension(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'IntradialyticHypotension', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DialysisDisequilibrium', (req, res) => { const r = F.DialysisDisequilibrium(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'DialysisDisequilibrium', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PeritonealDialysisPrescription', (req, res) => { const r = F.PeritonealDialysisPrescription(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'PeritonealDialysisPrescription', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PDPeritonitis', (req, res) => { const r = F.PDPeritonitis(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'PDPeritonitis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HomeHemodialysis', (req, res) => { const r = F.HomeHemodialysis(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'HomeHemodialysis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NocturnalDialysis', (req, res) => { const r = F.NocturnalDialysis(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'NocturnalDialysis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DialysisNutrition', (req, res) => { const r = F.DialysisNutrition(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'DialysisNutrition', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TransplantReadiness', (req, res) => { const r = F.TransplantReadiness(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis_advanced', function: 'TransplantReadiness', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_dialysis_advanced', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
