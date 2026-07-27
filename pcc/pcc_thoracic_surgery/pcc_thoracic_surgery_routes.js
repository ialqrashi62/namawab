// P3-DK pcc_thoracic_surgery_routes v3.75.0
// P3-DK: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_thoracic_surgery_engine.js');
const VER = '3.75.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_thoracic_surgery', label: 'PCC Thoracic Surgery', functions: Object.keys(Engine) });
});

router.post('/call/ThoracotomyRisk', (req, res) => { const r = Engine.ThoracotomyRisk(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'ThoracotomyRisk', plan: r.plan }); });
router.post('/call/VatsEligibility', (req, res) => { const r = Engine.VatsEligibility(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'VatsEligibility', plan: r.plan }); });
router.post('/call/LobectomyAssessment', (req, res) => { const r = Engine.LobectomyAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'LobectomyAssessment', plan: r.plan }); });
router.post('/call/ChestTubeProtocol', (req, res) => { const r = Engine.ChestTubeProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'ChestTubeProtocol', plan: r.plan }); });
router.post('/call/PneumothoraxManagement', (req, res) => { const r = Engine.PneumothoraxManagement(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'PneumothoraxManagement', plan: r.plan }); });
router.post('/call/PleuralEffusionPlan', (req, res) => { const r = Engine.PleuralEffusionPlan(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'PleuralEffusionPlan', plan: r.plan }); });
router.post('/call/MediastinalMassWorkup', (req, res) => { const r = Engine.MediastinalMassWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'MediastinalMassWorkup', plan: r.plan }); });
router.post('/call/ThoracicTraumaTriage', (req, res) => { const r = Engine.ThoracicTraumaTriage(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'ThoracicTraumaTriage', plan: r.plan }); });
router.post('/call/EsophagealSurgeryPrep', (req, res) => { const r = Engine.EsophagealSurgeryPrep(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'EsophagealSurgeryPrep', plan: r.plan }); });
router.post('/call/PostThoracotomyCare', (req, res) => { const r = Engine.PostThoracotomyCare(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'PostThoracotomyCare', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_thoracic_surgery', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
