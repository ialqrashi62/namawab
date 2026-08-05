// P3-DB pcc_metabolic_surgery_routes v3.66.0
// P3-DB: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_metabolic_surgery_engine.js');
const VER = '3.66.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_metabolic_surgery', label: 'PCC Metabolic Surgery', functions: Object.keys(F) });
});

router.post('/call/BariatricRisk', (req, res) => { const r = F.BariatricRisk(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'BariatricRisk', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ProcedureSelection', (req, res) => { const r = F.ProcedureSelection(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'ProcedureSelection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NutritionalDeficiency', (req, res) => { const r = F.NutritionalDeficiency(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'NutritionalDeficiency', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DumpingSyndrome', (req, res) => { const r = F.DumpingSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'DumpingSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/WeightRecurrence', (req, res) => { const r = F.WeightRecurrence(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'WeightRecurrence', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DiabetesRemission', (req, res) => { const r = F.DiabetesRemission(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'DiabetesRemission', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MetabolicMonitoring', (req, res) => { const r = F.MetabolicMonitoring(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'MetabolicMonitoring', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PreopOptimization', (req, res) => { const r = F.PreopOptimization(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'PreopOptimization', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PostopDiet', (req, res) => { const r = F.PostopDiet(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'PostopDiet', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LongTermFollowUp', (req, res) => { const r = F.LongTermFollowUp(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'LongTermFollowUp', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_metabolic_surgery', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
