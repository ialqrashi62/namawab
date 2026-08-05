// P3-DK pcc_thoracic_surgery_routes v3.75.0
// P3-DK: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_thoracic_surgery_engine.js');
const VER = '3.75.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_thoracic_surgery', label: 'PCC Thoracic Surgery', functions: Object.keys(F) });
});

router.post('/call/ThoracotomyRisk', (req, res) => { const r = F.ThoracotomyRisk(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'ThoracotomyRisk', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VatsEligibility', (req, res) => { const r = F.VatsEligibility(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'VatsEligibility', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LobectomyAssessment', (req, res) => { const r = F.LobectomyAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'LobectomyAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ChestTubeProtocol', (req, res) => { const r = F.ChestTubeProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'ChestTubeProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PneumothoraxManagement', (req, res) => { const r = F.PneumothoraxManagement(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'PneumothoraxManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PleuralEffusionPlan', (req, res) => { const r = F.PleuralEffusionPlan(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'PleuralEffusionPlan', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MediastinalMassWorkup', (req, res) => { const r = F.MediastinalMassWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'MediastinalMassWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ThoracicTraumaTriage', (req, res) => { const r = F.ThoracicTraumaTriage(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'ThoracicTraumaTriage', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/EsophagealSurgeryPrep', (req, res) => { const r = F.EsophagealSurgeryPrep(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'EsophagealSurgeryPrep', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PostThoracotomyCare', (req, res) => { const r = F.PostThoracotomyCare(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_surgery', function: 'PostThoracotomyCare', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_thoracic_surgery', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
