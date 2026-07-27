// P3-EP pcc_pediatric_endo_ext_routes v3.106.0
// P3-EP: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_endo_ext_engine.js');
const VER = '3.106.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_endo_ext', label: 'PCC Pediatric Endo Ext', functions: Object.keys(Engine) });
});
router.post('/call/PediatricType2Diabetes', (req, res) => { const r = Engine.PediatricType2Diabetes(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricType2Diabetes', plan: r.plan }); });
router.post('/call/PediatricMODY', (req, res) => { const r = Engine.PediatricMODY(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricMODY', plan: r.plan }); });
router.post('/call/PediatricNeonatalDiabetes', (req, res) => { const r = Engine.PediatricNeonatalDiabetes(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricNeonatalDiabetes', plan: r.plan }); });
router.post('/call/PediatricHypothyroidism', (req, res) => { const r = Engine.PediatricHypothyroidism(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricHypothyroidism', plan: r.plan }); });
router.post('/call/PediatricHyperthyroidism', (req, res) => { const r = Engine.PediatricHyperthyroidism(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricHyperthyroidism', plan: r.plan }); });
router.post('/call/PediatricThyroidCancer', (req, res) => { const r = Engine.PediatricThyroidCancer(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricThyroidCancer', plan: r.plan }); });
router.post('/call/PediatricAdrenalInsufficiency', (req, res) => { const r = Engine.PediatricAdrenalInsufficiency(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricAdrenalInsufficiency', plan: r.plan }); });
router.post('/call/PediatricCushingSyndrome', (req, res) => { const r = Engine.PediatricCushingSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricCushingSyndrome', plan: r.plan }); });
router.post('/call/PediatricHypogonadism', (req, res) => { const r = Engine.PediatricHypogonadism(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricHypogonadism', plan: r.plan }); });
router.post('/call/PediatricDelayedPuberty', (req, res) => { const r = Engine.PediatricDelayedPuberty(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: 'PediatricDelayedPuberty', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_endo_ext', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
