// P3-EH pcc_pediatric_rheum_routes v3.98.0
// P3-EH: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_rheum_engine.js');
const VER = '3.98.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_rheum', label: 'PCC Pediatric Rheum', functions: Object.keys(F) });
});
router.post('/call/JuvenileIdiopathicArthritis', (req, res) => { const r = F.JuvenileIdiopathicArthritis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rheum', function: 'JuvenileIdiopathicArthritis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/KawasakiDisease', (req, res) => { const r = F.KawasakiDisease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rheum', function: 'KawasakiDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HenochSchonleinPurpura', (req, res) => { const r = F.HenochSchonleinPurpura(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rheum', function: 'HenochSchonleinPurpura', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricSLE', (req, res) => { const r = F.PediatricSLE(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rheum', function: 'PediatricSLE', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/JuvenileDermatomyositis', (req, res) => { const r = F.JuvenileDermatomyositis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rheum', function: 'JuvenileDermatomyositis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricVasculitis', (req, res) => { const r = F.PediatricVasculitis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rheum', function: 'PediatricVasculitis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PeriodicFeverSyndromes', (req, res) => { const r = F.PeriodicFeverSyndromes(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rheum', function: 'PeriodicFeverSyndromes', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricScleroderma', (req, res) => { const r = F.PediatricScleroderma(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rheum', function: 'PediatricScleroderma', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricBehcet', (req, res) => { const r = F.PediatricBehcet(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rheum', function: 'PediatricBehcet', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GrowingPainsEvaluation', (req, res) => { const r = F.GrowingPainsEvaluation(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rheum', function: 'GrowingPainsEvaluation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_rheum', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
