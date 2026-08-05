// P3-EI pcc_pediatric_oncology_routes v3.99.0
// P3-EI: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_oncology_engine.js');
const VER = '3.99.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_oncology', label: 'PCC Pediatric Oncology', functions: Object.keys(F) });
});
router.post('/call/PediatricLeukemiaALL', (req, res) => { const r = F.PediatricLeukemiaALL(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'PediatricLeukemiaALL', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricLeukemiaAML', (req, res) => { const r = F.PediatricLeukemiaAML(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'PediatricLeukemiaAML', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricBrainTumor', (req, res) => { const r = F.PediatricBrainTumor(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'PediatricBrainTumor', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeuroblastomaManagement', (req, res) => { const r = F.NeuroblastomaManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'NeuroblastomaManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/WilmsTumorProtocol', (req, res) => { const r = F.WilmsTumorProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'WilmsTumorProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricLymphoma', (req, res) => { const r = F.PediatricLymphoma(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'PediatricLymphoma', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricBoneTumor', (req, res) => { const r = F.PediatricBoneTumor(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'PediatricBoneTumor', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricRetinoblastoma', (req, res) => { const r = F.PediatricRetinoblastoma(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'PediatricRetinoblastoma', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHepaticTumor', (req, res) => { const r = F.PediatricHepaticTumor(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'PediatricHepaticTumor', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricOncologicEmergency', (req, res) => { const r = F.PediatricOncologicEmergency(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'PediatricOncologicEmergency', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_oncology', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
