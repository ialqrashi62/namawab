// P3-DT pcc_chest_pain_unit_routes v3.84.0
// P3-DT: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_chest_pain_unit_engine.js');
const VER = '3.84.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_chest_pain_unit', label: 'PCC Chest Pain Unit', functions: Object.keys(Engine) });
});
router.post('/call/HEARTPathway', (req, res) => { const r = Engine.HEARTPathway(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'HEARTPathway', plan: r.plan }); });
router.post('/call/GRACEACS', (req, res) => { const r = Engine.GRACEACS(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'GRACEACS', plan: r.plan }); });
router.post('/call/TIMIScore', (req, res) => { const r = Engine.TIMIScore(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'TIMIScore', plan: r.plan }); });
router.post('/call/WellensCriteria', (req, res) => { const r = Engine.WellensCriteria(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'WellensCriteria', plan: r.plan }); });
router.post('/call/DukeTreadmillScore', (req, res) => { const r = Engine.DukeTreadmillScore(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'DukeTreadmillScore', plan: r.plan }); });
router.post('/call/ChestPainRiskStrat', (req, res) => { const r = Engine.ChestPainRiskStrat(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'ChestPainRiskStrat', plan: r.plan }); });
router.post('/call/HsTroponinRuleOut', (req, res) => { const r = Engine.HsTroponinRuleOut(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'HsTroponinRuleOut', plan: r.plan }); });
router.post('/call/CoronaryCalciumScore', (req, res) => { const r = Engine.CoronaryCalciumScore(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'CoronaryCalciumScore', plan: r.plan }); });
router.post('/call/PrinzmetalAngina', (req, res) => { const r = Engine.PrinzmetalAngina(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'PrinzmetalAngina', plan: r.plan }); });
router.post('/call/AorticDissectionRisk', (req, res) => { const r = Engine.AorticDissectionRisk(req.body || {}); res.json({ version: VER, module: 'pcc_chest_pain_unit', function: 'AorticDissectionRisk', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_chest_pain_unit', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
