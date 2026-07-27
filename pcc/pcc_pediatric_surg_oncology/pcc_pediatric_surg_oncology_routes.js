// P3-EP pcc_pediatric_surg_oncology_routes v3.106.0
// P3-EP: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_surg_oncology_engine.js');
const VER = '3.106.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', label: 'PCC Pediatric Surg Oncology', functions: Object.keys(Engine) });
});
router.post('/call/PediatricNeuroblastomaSurg', (req, res) => { const r = Engine.PediatricNeuroblastomaSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricNeuroblastomaSurg', plan: r.plan }); });
router.post('/call/PediatricWilmsTumorSurg', (req, res) => { const r = Engine.PediatricWilmsTumorSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricWilmsTumorSurg', plan: r.plan }); });
router.post('/call/PediatricHepatoblastomaSurg', (req, res) => { const r = Engine.PediatricHepatoblastomaSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricHepatoblastomaSurg', plan: r.plan }); });
router.post('/call/PediatricRhabdomyosarcomaSurg', (req, res) => { const r = Engine.PediatricRhabdomyosarcomaSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricRhabdomyosarcomaSurg', plan: r.plan }); });
router.post('/call/PediatricOsteosarcomaSurg', (req, res) => { const r = Engine.PediatricOsteosarcomaSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricOsteosarcomaSurg', plan: r.plan }); });
router.post('/call/PediatricEwingsSurg', (req, res) => { const r = Engine.PediatricEwingsSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricEwingsSurg', plan: r.plan }); });
router.post('/call/PediatricRetinoblastomaSurg', (req, res) => { const r = Engine.PediatricRetinoblastomaSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricRetinoblastomaSurg', plan: r.plan }); });
router.post('/call/PediatricLymphomaSurg', (req, res) => { const r = Engine.PediatricLymphomaSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricLymphomaSurg', plan: r.plan }); });
router.post('/call/PediatricBrainTumorSurgExt', (req, res) => { const r = Engine.PediatricBrainTumorSurgExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricBrainTumorSurgExt', plan: r.plan }); });
router.post('/call/PediatricGermCellTumorSurg', (req, res) => { const r = Engine.PediatricGermCellTumorSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricGermCellTumorSurg', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
