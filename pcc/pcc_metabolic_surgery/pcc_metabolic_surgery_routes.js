// P3-DB pcc_metabolic_surgery_routes v3.66.0
// P3-DB: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_metabolic_surgery_engine.js');
const VER = '3.66.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_metabolic_surgery', label: 'PCC Metabolic Surgery', functions: Object.keys(Engine) });
});

router.post('/call/BariatricRisk', (req, res) => { const r = Engine.BariatricRisk(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'BariatricRisk', plan: r.plan }); });
router.post('/call/ProcedureSelection', (req, res) => { const r = Engine.ProcedureSelection(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'ProcedureSelection', plan: r.plan }); });
router.post('/call/NutritionalDeficiency', (req, res) => { const r = Engine.NutritionalDeficiency(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'NutritionalDeficiency', plan: r.plan }); });
router.post('/call/DumpingSyndrome', (req, res) => { const r = Engine.DumpingSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'DumpingSyndrome', plan: r.plan }); });
router.post('/call/WeightRecurrence', (req, res) => { const r = Engine.WeightRecurrence(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'WeightRecurrence', plan: r.plan }); });
router.post('/call/DiabetesRemission', (req, res) => { const r = Engine.DiabetesRemission(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'DiabetesRemission', plan: r.plan }); });
router.post('/call/MetabolicMonitoring', (req, res) => { const r = Engine.MetabolicMonitoring(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'MetabolicMonitoring', plan: r.plan }); });
router.post('/call/PreopOptimization', (req, res) => { const r = Engine.PreopOptimization(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'PreopOptimization', plan: r.plan }); });
router.post('/call/PostopDiet', (req, res) => { const r = Engine.PostopDiet(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'PostopDiet', plan: r.plan }); });
router.post('/call/LongTermFollowUp', (req, res) => { const r = Engine.LongTermFollowUp(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_surgery', function: 'LongTermFollowUp', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_metabolic_surgery', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
