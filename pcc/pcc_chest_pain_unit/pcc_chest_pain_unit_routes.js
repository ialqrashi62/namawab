// P3-DT pcc_chest_pain_unit_routes v3.84.0
// P3-DT: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_chest_pain_unit_engine.js');
const VER = '3.84.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_chest_pain_unit', label: 'PCC Chest Pain Unit', functions: Object.keys(F) });
});
router.post('/call/HEARTPathway', (req, res) => { const r = F.HEARTPathway(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'HEARTPathway', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GRACEACS', (req, res) => { const r = F.GRACEACS(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'GRACEACS', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TIMIScore', (req, res) => { const r = F.TIMIScore(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'TIMIScore', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/WellensCriteria', (req, res) => { const r = F.WellensCriteria(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'WellensCriteria', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DukeTreadmillScore', (req, res) => { const r = F.DukeTreadmillScore(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'DukeTreadmillScore', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ChestPainRiskStrat', (req, res) => { const r = F.ChestPainRiskStrat(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'ChestPainRiskStrat', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HsTroponinRuleOut', (req, res) => { const r = F.HsTroponinRuleOut(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'HsTroponinRuleOut', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CoronaryCalciumScore', (req, res) => { const r = F.CoronaryCalciumScore(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'CoronaryCalciumScore', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PrinzmetalAngina', (req, res) => { const r = F.PrinzmetalAngina(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'PrinzmetalAngina', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AorticDissectionRisk', (req, res) => { const r = F.AorticDissectionRisk(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'AorticDissectionRisk', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_chest_pain_unit', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
