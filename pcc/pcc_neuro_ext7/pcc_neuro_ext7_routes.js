// P3-EP pcc_neuro_ext7_routes v3.106.0
// P3-EP: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_neuro_ext7_engine.js');
const VER = '3.106.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ext7', label: 'PCC Neuro Ext7', functions: Object.keys(Engine) });
});
router.post('/call/SpinalMuscularAtrophy', (req, res) => { const r = Engine.SpinalMuscularAtrophy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'SpinalMuscularAtrophy', plan: r.plan }); });
router.post('/call/BeckerMuscularDystrophy', (req, res) => { const r = Engine.BeckerMuscularDystrophy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'BeckerMuscularDystrophy', plan: r.plan }); });
router.post('/call/DuchenneMuscularDystrophy', (req, res) => { const r = Engine.DuchenneMuscularDystrophy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'DuchenneMuscularDystrophy', plan: r.plan }); });
router.post('/call/FacioscapulohumeralMD', (req, res) => { const r = Engine.FacioscapulohumeralMD(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'FacioscapulohumeralMD', plan: r.plan }); });
router.post('/call/LimbGirdleMD', (req, res) => { const r = Engine.LimbGirdleMD(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'LimbGirdleMD', plan: r.plan }); });
router.post('/call/OculopharyngealMD', (req, res) => { const r = Engine.OculopharyngealMD(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'OculopharyngealMD', plan: r.plan }); });
router.post('/call/MyotonicDystrophyExt', (req, res) => { const r = Engine.MyotonicDystrophyExt(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'MyotonicDystrophyExt', plan: r.plan }); });
router.post('/call/CongenitalMyopathy', (req, res) => { const r = Engine.CongenitalMyopathy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'CongenitalMyopathy', plan: r.plan }); });
router.post('/call/MitochondrialMyopathy', (req, res) => { const r = Engine.MitochondrialMyopathy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'MitochondrialMyopathy', plan: r.plan }); });
router.post('/call/InflammatoryMyopathy', (req, res) => { const r = Engine.InflammatoryMyopathy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext7', function: 'InflammatoryMyopathy', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ext7', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
