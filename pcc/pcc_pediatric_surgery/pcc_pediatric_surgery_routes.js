// P3-DW pcc_pediatric_surgery_routes v3.87.0
// P3-DW: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_surgery_engine.js');
const VER = '3.87.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_surgery', label: 'PCC Pediatric Surgery', functions: Object.keys(F) });
});
router.post('/call/PediatricAppendectomyIndication', (req, res) => { const r = F.PediatricAppendectomyIndication(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'PediatricAppendectomyIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PyloricStenosisPyloromyotomy', (req, res) => { const r = F.PyloricStenosisPyloromyotomy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'PyloricStenosisPyloromyotomy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHerniaRepair', (req, res) => { const r = F.PediatricHerniaRepair(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'PediatricHerniaRepair', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/IntussusceptionReduction', (req, res) => { const r = F.IntussusceptionReduction(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'IntussusceptionReduction', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCircumcision', (req, res) => { const r = F.PediatricCircumcision(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'PediatricCircumcision', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricTonsillectomy', (req, res) => { const r = F.PediatricTonsillectomy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'PediatricTonsillectomy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCholecystectomy', (req, res) => { const r = F.PediatricCholecystectomy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'PediatricCholecystectomy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricBowelObstruction', (req, res) => { const r = F.PediatricBowelObstruction(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'PediatricBowelObstruction', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricTracheostomy', (req, res) => { const r = F.PediatricTracheostomy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'PediatricTracheostomy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricChestWallDeformity', (req, res) => { const r = F.PediatricChestWallDeformity(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'PediatricChestWallDeformity', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_surgery', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
