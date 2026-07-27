// P3-EI pcc_pediatric_oncology_routes v3.99.0
// P3-EI: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_oncology_engine.js');
const VER = '3.99.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_oncology', label: 'PCC Pediatric Oncology', functions: Object.keys(Engine) });
});
router.post('/call/PediatricLeukemiaALL', (req, res) => { const r = Engine.PediatricLeukemiaALL(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'PediatricLeukemiaALL', plan: r.plan }); });
router.post('/call/PediatricLeukemiaAML', (req, res) => { const r = Engine.PediatricLeukemiaAML(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'PediatricLeukemiaAML', plan: r.plan }); });
router.post('/call/PediatricBrainTumor', (req, res) => { const r = Engine.PediatricBrainTumor(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'PediatricBrainTumor', plan: r.plan }); });
router.post('/call/NeuroblastomaManagement', (req, res) => { const r = Engine.NeuroblastomaManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'NeuroblastomaManagement', plan: r.plan }); });
router.post('/call/WilmsTumorProtocol', (req, res) => { const r = Engine.WilmsTumorProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'WilmsTumorProtocol', plan: r.plan }); });
router.post('/call/PediatricLymphoma', (req, res) => { const r = Engine.PediatricLymphoma(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'PediatricLymphoma', plan: r.plan }); });
router.post('/call/PediatricBoneTumor', (req, res) => { const r = Engine.PediatricBoneTumor(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'PediatricBoneTumor', plan: r.plan }); });
router.post('/call/PediatricRetinoblastoma', (req, res) => { const r = Engine.PediatricRetinoblastoma(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'PediatricRetinoblastoma', plan: r.plan }); });
router.post('/call/PediatricHepaticTumor', (req, res) => { const r = Engine.PediatricHepaticTumor(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'PediatricHepaticTumor', plan: r.plan }); });
router.post('/call/PediatricOncologicEmergency', (req, res) => { const r = Engine.PediatricOncologicEmergency(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology', function: 'PediatricOncologicEmergency', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_oncology', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
