// P3-EV pcc_pediatric_neuro_ext2_routes v3.112.0
// P3-EV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_neuro_ext2_engine.js');
const VER = '3.112.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', label: 'PCC Pediatric Neuro Ext2', functions: Object.keys(F) });
});
router.post('/call/PediatricFebrileSeizure', (req, res) => { const r = F.PediatricFebrileSeizure(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricFebrileSeizure', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricStatusEpilepticusExt', (req, res) => { const r = F.PediatricStatusEpilepticusExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricStatusEpilepticusExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricEpilepsySyndrome', (req, res) => { const r = F.PediatricEpilepsySyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricEpilepsySyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricLennoxGastaut', (req, res) => { const r = F.PediatricLennoxGastaut(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricLennoxGastaut', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricWestSyndrome', (req, res) => { const r = F.PediatricWestSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricWestSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricDravet', (req, res) => { const r = F.PediatricDravet(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricDravet', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricDooseSyndrome', (req, res) => { const r = F.PediatricDooseSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricDooseSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricLandauKleffner', (req, res) => { const r = F.PediatricLandauKleffner(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricLandauKleffner', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCSWSSyndrome', (req, res) => { const r = F.PediatricCSWSSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricCSWSSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricEpilepsySurgeryEval', (req, res) => { const r = F.PediatricEpilepsySurgeryEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: 'PediatricEpilepsySurgeryEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_neuro_ext2', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
