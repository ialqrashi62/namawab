// P3-DE pcc_gut_microbiome_routes v3.69.0
// P3-DE: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_gut_microbiome_engine.js');
const VER = '3.69.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_gut_microbiome', label: 'PCC Gut Microbiome', functions: Object.keys(F) });
});

router.post('/call/DysbiosisAssessment', (req, res) => { const r = F.DysbiosisAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'DysbiosisAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Probiotics', (req, res) => { const r = F.Probiotics(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'Probiotics', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Prebiotics', (req, res) => { const r = F.Prebiotics(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'Prebiotics', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FecalTransplant', (req, res) => { const r = F.FecalTransplant(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'FecalTransplant', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SIBO', (req, res) => { const r = F.SIBO(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'SIBO', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LeakyGut', (req, res) => { const r = F.LeakyGut(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'LeakyGut', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GutBrainAxis', (req, res) => { const r = F.GutBrainAxis(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'GutBrainAxis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MicrobiomeTesting', (req, res) => { const r = F.MicrobiomeTesting(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'MicrobiomeTesting', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DietaryFiber', (req, res) => { const r = F.DietaryFiber(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'DietaryFiber', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PostbioticTherapy', (req, res) => { const r = F.PostbioticTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_gut_microbiome', function: 'PostbioticTherapy', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_gut_microbiome', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
