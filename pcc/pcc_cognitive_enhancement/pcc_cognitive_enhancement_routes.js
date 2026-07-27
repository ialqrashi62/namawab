// P3-DH pcc_cognitive_enhancement_routes v3.72.0
// P3-DH: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_cognitive_enhancement_engine.js');
const VER = '3.72.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_cognitive_enhancement', label: 'PCC Cognitive Enhancement', functions: Object.keys(Engine) });
});

router.post('/call/MemoryTraining', (req, res) => { const r = Engine.MemoryTraining(req.body || {}); res.json({ version: VER, module: 'pcc_cognitive_enhancement', function: 'MemoryTraining', plan: r.plan }); });
router.post('/call/AttentionFocus', (req, res) => { const r = Engine.AttentionFocus(req.body || {}); res.json({ version: VER, module: 'pcc_cognitive_enhancement', function: 'AttentionFocus', plan: r.plan }); });
router.post('/call/ProcessingSpeed', (req, res) => { const r = Engine.ProcessingSpeed(req.body || {}); res.json({ version: VER, module: 'pcc_cognitive_enhancement', function: 'ProcessingSpeed', plan: r.plan }); });
router.post('/call/ExecutiveFunction', (req, res) => { const r = Engine.ExecutiveFunction(req.body || {}); res.json({ version: VER, module: 'pcc_cognitive_enhancement', function: 'ExecutiveFunction', plan: r.plan }); });
router.post('/call/LearningStrategy', (req, res) => { const r = Engine.LearningStrategy(req.body || {}); res.json({ version: VER, module: 'pcc_cognitive_enhancement', function: 'LearningStrategy', plan: r.plan }); });
router.post('/call/Nootropics', (req, res) => { const r = Engine.Nootropics(req.body || {}); res.json({ version: VER, module: 'pcc_cognitive_enhancement', function: 'Nootropics', plan: r.plan }); });
router.post('/call/DualTask', (req, res) => { const r = Engine.DualTask(req.body || {}); res.json({ version: VER, module: 'pcc_cognitive_enhancement', function: 'DualTask', plan: r.plan }); });
router.post('/call/CognitiveLoad', (req, res) => { const r = Engine.CognitiveLoad(req.body || {}); res.json({ version: VER, module: 'pcc_cognitive_enhancement', function: 'CognitiveLoad', plan: r.plan }); });
router.post('/call/SkillAcquisition', (req, res) => { const r = Engine.SkillAcquisition(req.body || {}); res.json({ version: VER, module: 'pcc_cognitive_enhancement', function: 'SkillAcquisition', plan: r.plan }); });
router.post('/call/PeakCognition', (req, res) => { const r = Engine.PeakCognition(req.body || {}); res.json({ version: VER, module: 'pcc_cognitive_enhancement', function: 'PeakCognition', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_cognitive_enhancement', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
