// P3-EG pcc_pediatric_endo_routes v3.97.0
// P3-EG: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_endo_engine.js');
const VER = '3.97.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_endo', label: 'PCC Pediatric Endo', functions: Object.keys(Engine) });
});
router.post('/call/PediatricDiabetesType1', (req, res) => { const r = Engine.PediatricDiabetesType1(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'PediatricDiabetesType1', plan: r.plan }); });
router.post('/call/PediatricThyroidDisease', (req, res) => { const r = Engine.PediatricThyroidDisease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'PediatricThyroidDisease', plan: r.plan }); });
router.post('/call/CongenitalAdrenalHyperplasia', (req, res) => { const r = Engine.CongenitalAdrenalHyperplasia(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'CongenitalAdrenalHyperplasia', plan: r.plan }); });
router.post('/call/PediatricGrowthDisorder', (req, res) => { const r = Engine.PediatricGrowthDisorder(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'PediatricGrowthDisorder', plan: r.plan }); });
router.post('/call/PediatricPubertyDisorders', (req, res) => { const r = Engine.PediatricPubertyDisorders(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'PediatricPubertyDisorders', plan: r.plan }); });
router.post('/call/PediatricObesityEndocrine', (req, res) => { const r = Engine.PediatricObesityEndocrine(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'PediatricObesityEndocrine', plan: r.plan }); });
router.post('/call/PediatricBoneDisease', (req, res) => { const r = Engine.PediatricBoneDisease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'PediatricBoneDisease', plan: r.plan }); });
router.post('/call/PediatricPituitaryDisorders', (req, res) => { const r = Engine.PediatricPituitaryDisorders(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'PediatricPituitaryDisorders', plan: r.plan }); });
router.post('/call/PediatricLipidDisorders', (req, res) => { const r = Engine.PediatricLipidDisorders(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'PediatricLipidDisorders', plan: r.plan }); });
router.post('/call/NeonatalThyroidScreening', (req, res) => { const r = Engine.NeonatalThyroidScreening(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'NeonatalThyroidScreening', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_endo', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
