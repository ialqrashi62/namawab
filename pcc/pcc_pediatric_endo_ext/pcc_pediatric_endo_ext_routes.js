// P3-EP pcc_pediatric_endo_ext_routes v3.106.0
// P3-EP: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_endo_ext_engine.js');
const VER = '3.106.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_endo_ext', label: 'PCC Pediatric Endo Ext', functions: Object.keys(F) });
});
router.post('/call/PediatricType2Diabetes', (req, res) => { const r = F.PediatricType2Diabetes(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricType2Diabetes', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricMODY', (req, res) => { const r = F.PediatricMODY(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricMODY', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricNeonatalDiabetes', (req, res) => { const r = F.PediatricNeonatalDiabetes(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricNeonatalDiabetes', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHypothyroidism', (req, res) => { const r = F.PediatricHypothyroidism(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricHypothyroidism', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHyperthyroidism', (req, res) => { const r = F.PediatricHyperthyroidism(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricHyperthyroidism', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricThyroidCancer', (req, res) => { const r = F.PediatricThyroidCancer(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricThyroidCancer', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricAdrenalInsufficiency', (req, res) => { const r = F.PediatricAdrenalInsufficiency(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricAdrenalInsufficiency', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCushingSyndrome', (req, res) => { const r = F.PediatricCushingSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricCushingSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHypogonadism', (req, res) => { const r = F.PediatricHypogonadism(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricHypogonadism', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricDelayedPuberty', (req, res) => { const r = F.PediatricDelayedPuberty(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricDelayedPuberty', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
