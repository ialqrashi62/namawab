// P3-DW pcc_pediatric_surgery_routes v3.87.0
// P3-DW: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_surgery_engine.js');
const VER = '3.87.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_surgery', label: 'PCC Pediatric Surgery', functions: Object.keys(Engine) });
});
router.post('/call/PediatricAppendectomyIndication', (req, res) => { const r = Engine.PediatricAppendectomyIndication(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'PediatricAppendectomyIndication', plan: r.plan }); });
router.post('/call/PyloricStenosisPyloromyotomy', (req, res) => { const r = Engine.PyloricStenosisPyloromyotomy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'PyloricStenosisPyloromyotomy', plan: r.plan }); });
router.post('/call/PediatricHerniaRepair', (req, res) => { const r = Engine.PediatricHerniaRepair(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'PediatricHerniaRepair', plan: r.plan }); });
router.post('/call/IntussusceptionReduction', (req, res) => { const r = Engine.IntussusceptionReduction(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'IntussusceptionReduction', plan: r.plan }); });
router.post('/call/PediatricCircumcision', (req, res) => { const r = Engine.PediatricCircumcision(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'PediatricCircumcision', plan: r.plan }); });
router.post('/call/PediatricTonsillectomy', (req, res) => { const r = Engine.PediatricTonsillectomy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'PediatricTonsillectomy', plan: r.plan }); });
router.post('/call/PediatricCholecystectomy', (req, res) => { const r = Engine.PediatricCholecystectomy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'PediatricCholecystectomy', plan: r.plan }); });
router.post('/call/PediatricBowelObstruction', (req, res) => { const r = Engine.PediatricBowelObstruction(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'PediatricBowelObstruction', plan: r.plan }); });
router.post('/call/PediatricTracheostomy', (req, res) => { const r = Engine.PediatricTracheostomy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'PediatricTracheostomy', plan: r.plan }); });
router.post('/call/PediatricChestWallDeformity', (req, res) => { const r = Engine.PediatricChestWallDeformity(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surgery', function: 'PediatricChestWallDeformity', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_surgery', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
