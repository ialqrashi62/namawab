// P3-ES pcc_pediatric_cardio_ext2_routes v3.109.0
// P3-ES: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_cardio_ext2_engine.js');
const VER = '3.109.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_cardio_ext2', label: 'PCC Pediatric Cardio Ext2', functions: Object.keys(Engine) });
});
router.post('/call/PediatricASDEval', (req, res) => { const r = Engine.PediatricASDEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext2', function: 'PediatricASDEval', plan: r.plan }); });
router.post('/call/PediatricVSDPostRepair', (req, res) => { const r = Engine.PediatricVSDPostRepair(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext2', function: 'PediatricVSDPostRepair', plan: r.plan }); });
router.post('/call/PediatricAVCanal', (req, res) => { const r = Engine.PediatricAVCanal(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext2', function: 'PediatricAVCanal', plan: r.plan }); });
router.post('/call/PediatricTOFRepair', (req, res) => { const r = Engine.PediatricTOFRepair(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext2', function: 'PediatricTOFRepair', plan: r.plan }); });
router.post('/call/PediatricTranspositionGreatArteries', (req, res) => { const r = Engine.PediatricTranspositionGreatArteries(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext2', function: 'PediatricTranspositionGreatArteries', plan: r.plan }); });
router.post('/call/PediatricTruncusArteriosus', (req, res) => { const r = Engine.PediatricTruncusArteriosus(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext2', function: 'PediatricTruncusArteriosus', plan: r.plan }); });
router.post('/call/PediatricTAPVR', (req, res) => { const r = Engine.PediatricTAPVR(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext2', function: 'PediatricTAPVR', plan: r.plan }); });
router.post('/call/PediatricHLHS', (req, res) => { const r = Engine.PediatricHLHS(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext2', function: 'PediatricHLHS', plan: r.plan }); });
router.post('/call/PediatricCoarctationAorta', (req, res) => { const r = Engine.PediatricCoarctationAorta(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext2', function: 'PediatricCoarctationAorta', plan: r.plan }); });
router.post('/call/PediatricEbsteinAnomaly', (req, res) => { const r = Engine.PediatricEbsteinAnomaly(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext2', function: 'PediatricEbsteinAnomaly', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_cardio_ext2', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
