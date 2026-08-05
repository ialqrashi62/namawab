// P3-EP pcc_pediatric_surg_oncology_routes v3.106.0
// P3-EP: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_surg_oncology_engine.js');
const VER = '3.106.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', label: 'PCC Pediatric Surg Oncology', functions: Object.keys(F) });
});
router.post('/call/PediatricNeuroblastomaSurg', (req, res) => { const r = F.PediatricNeuroblastomaSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricNeuroblastomaSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricWilmsTumorSurg', (req, res) => { const r = F.PediatricWilmsTumorSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricWilmsTumorSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHepatoblastomaSurg', (req, res) => { const r = F.PediatricHepatoblastomaSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricHepatoblastomaSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricRhabdomyosarcomaSurg', (req, res) => { const r = F.PediatricRhabdomyosarcomaSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricRhabdomyosarcomaSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricOsteosarcomaSurg', (req, res) => { const r = F.PediatricOsteosarcomaSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricOsteosarcomaSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricEwingsSurg', (req, res) => { const r = F.PediatricEwingsSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricEwingsSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricRetinoblastomaSurg', (req, res) => { const r = F.PediatricRetinoblastomaSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricRetinoblastomaSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricLymphomaSurg', (req, res) => { const r = F.PediatricLymphomaSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricLymphomaSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricBrainTumorSurgExt', (req, res) => { const r = F.PediatricBrainTumorSurgExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricBrainTumorSurgExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricGermCellTumorSurg', (req, res) => { const r = F.PediatricGermCellTumorSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: 'PediatricGermCellTumorSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_surg_oncology', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
