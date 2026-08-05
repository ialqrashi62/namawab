// P3-EP pcc_neuro_ext7_routes v3.106.0
// P3-EP: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neuro_ext7_engine.js');
const VER = '3.106.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ext7', label: 'PCC Neuro Ext7', functions: Object.keys(F) });
});
router.post('/call/SpinalMuscularAtrophy', (req, res) => { const r = F.SpinalMuscularAtrophy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'SpinalMuscularAtrophy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BeckerMuscularDystrophy', (req, res) => { const r = F.BeckerMuscularDystrophy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'BeckerMuscularDystrophy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DuchenneMuscularDystrophy', (req, res) => { const r = F.DuchenneMuscularDystrophy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'DuchenneMuscularDystrophy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FacioscapulohumeralMD', (req, res) => { const r = F.FacioscapulohumeralMD(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'FacioscapulohumeralMD', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LimbGirdleMD', (req, res) => { const r = F.LimbGirdleMD(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'LimbGirdleMD', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/OculopharyngealMD', (req, res) => { const r = F.OculopharyngealMD(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'OculopharyngealMD', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MyotonicDystrophyExt', (req, res) => { const r = F.MyotonicDystrophyExt(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'MyotonicDystrophyExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CongenitalMyopathy', (req, res) => { const r = F.CongenitalMyopathy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'CongenitalMyopathy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MitochondrialMyopathy', (req, res) => { const r = F.MitochondrialMyopathy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'MitochondrialMyopathy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/InflammatoryMyopathy', (req, res) => { const r = F.InflammatoryMyopathy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'InflammatoryMyopathy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ext7', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
