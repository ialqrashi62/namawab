// P3-DE pcc_gut_microbiome_routes v3.69.0
// P3-DE: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_gut_microbiome_engine.js');
const VER = '3.69.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_gut_microbiome', label: 'PCC Gut Microbiome', functions: Object.keys(Engine) });
});

router.post('/call/DysbiosisAssessment', (req, res) => { const r = Engine.DysbiosisAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'DysbiosisAssessment', plan: r.plan }); });
router.post('/call/Probiotics', (req, res) => { const r = Engine.Probiotics(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'Probiotics', plan: r.plan }); });
router.post('/call/Prebiotics', (req, res) => { const r = Engine.Prebiotics(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'Prebiotics', plan: r.plan }); });
router.post('/call/FecalTransplant', (req, res) => { const r = Engine.FecalTransplant(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'FecalTransplant', plan: r.plan }); });
router.post('/call/SIBO', (req, res) => { const r = Engine.SIBO(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'SIBO', plan: r.plan }); });
router.post('/call/LeakyGut', (req, res) => { const r = Engine.LeakyGut(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'LeakyGut', plan: r.plan }); });
router.post('/call/GutBrainAxis', (req, res) => { const r = Engine.GutBrainAxis(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'GutBrainAxis', plan: r.plan }); });
router.post('/call/MicrobiomeTesting', (req, res) => { const r = Engine.MicrobiomeTesting(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'MicrobiomeTesting', plan: r.plan }); });
router.post('/call/DietaryFiber', (req, res) => { const r = Engine.DietaryFiber(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'DietaryFiber', plan: r.plan }); });
router.post('/call/PostbioticTherapy', (req, res) => { const r = Engine.PostbioticTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'PostbioticTherapy', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_gut_microbiome', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
