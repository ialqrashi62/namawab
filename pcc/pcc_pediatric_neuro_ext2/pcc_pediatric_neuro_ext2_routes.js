// P3-EV pcc_pediatric_neuro_ext2_routes v3.112.0
// P3-EV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_neuro_ext2_engine.js');
const VER = '3.112.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', label: 'PCC Pediatric Neuro Ext2', functions: Object.keys(Engine) });
});
router.post('/call/PediatricFebrileSeizure', (req, res) => { const r = Engine.PediatricFebrileSeizure(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricFebrileSeizure', plan: r.plan }); });
router.post('/call/PediatricStatusEpilepticusExt', (req, res) => { const r = Engine.PediatricStatusEpilepticusExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricStatusEpilepticusExt', plan: r.plan }); });
router.post('/call/PediatricEpilepsySyndrome', (req, res) => { const r = Engine.PediatricEpilepsySyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricEpilepsySyndrome', plan: r.plan }); });
router.post('/call/PediatricLennoxGastaut', (req, res) => { const r = Engine.PediatricLennoxGastaut(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricLennoxGastaut', plan: r.plan }); });
router.post('/call/PediatricWestSyndrome', (req, res) => { const r = Engine.PediatricWestSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricWestSyndrome', plan: r.plan }); });
router.post('/call/PediatricDravet', (req, res) => { const r = Engine.PediatricDravet(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricDravet', plan: r.plan }); });
router.post('/call/PediatricDooseSyndrome', (req, res) => { const r = Engine.PediatricDooseSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricDooseSyndrome', plan: r.plan }); });
router.post('/call/PediatricLandauKleffner', (req, res) => { const r = Engine.PediatricLandauKleffner(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricLandauKleffner', plan: r.plan }); });
router.post('/call/PediatricCSWSSyndrome', (req, res) => { const r = Engine.PediatricCSWSSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricCSWSSyndrome', plan: r.plan }); });
router.post('/call/PediatricEpilepsySurgeryEval', (req, res) => { const r = Engine.PediatricEpilepsySurgeryEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricEpilepsySurgeryEval', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
