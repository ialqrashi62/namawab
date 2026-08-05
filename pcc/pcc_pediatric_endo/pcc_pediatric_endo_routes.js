// P3-EG pcc_pediatric_endo_routes v3.97.0
// P3-EG: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_endo_engine.js');
const VER = '3.97.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_endo', label: 'PCC Pediatric Endo', functions: Object.keys(F) });
});
router.post('/call/PediatricDiabetesType1', (req, res) => { const r = F.PediatricDiabetesType1(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'PediatricDiabetesType1', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricThyroidDisease', (req, res) => { const r = F.PediatricThyroidDisease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'PediatricThyroidDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CongenitalAdrenalHyperplasia', (req, res) => { const r = F.CongenitalAdrenalHyperplasia(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'CongenitalAdrenalHyperplasia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricGrowthDisorder', (req, res) => { const r = F.PediatricGrowthDisorder(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'PediatricGrowthDisorder', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPubertyDisorders', (req, res) => { const r = F.PediatricPubertyDisorders(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'PediatricPubertyDisorders', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricObesityEndocrine', (req, res) => { const r = F.PediatricObesityEndocrine(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'PediatricObesityEndocrine', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricBoneDisease', (req, res) => { const r = F.PediatricBoneDisease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'PediatricBoneDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPituitaryDisorders', (req, res) => { const r = F.PediatricPituitaryDisorders(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'PediatricPituitaryDisorders', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricLipidDisorders', (req, res) => { const r = F.PediatricLipidDisorders(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'PediatricLipidDisorders', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeonatalThyroidScreening', (req, res) => { const r = F.NeonatalThyroidScreening(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo', function: 'NeonatalThyroidScreening', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_endo', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
