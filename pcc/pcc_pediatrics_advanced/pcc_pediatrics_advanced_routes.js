// P3-DQ pcc_pediatrics_advanced_routes v3.81.0
// P3-DQ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatrics_advanced_engine.js');
const VER = '3.81.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatrics_advanced', label: 'PCC Pediatrics Advanced', functions: Object.keys(F) });
});

router.post('/call/PediatricSepsisAdvanced', (req, res) => { const r = F.PediatricSepsisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'PediatricSepsisAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DiabeticKetoacidosisPedi', (req, res) => { const r = F.DiabeticKetoacidosisPedi(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'DiabeticKetoacidosisPedi', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/StatusEpilepticusPedi', (req, res) => { const r = F.StatusEpilepticusPedi(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'StatusEpilepticusPedi', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BronchiolitisSevere', (req, res) => { const r = F.BronchiolitisSevere(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'BronchiolitisSevere', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricAsthmaSevere', (req, res) => { const r = F.PediatricAsthmaSevere(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'PediatricAsthmaSevere', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CongenitalHeartDisease', (req, res) => { const r = F.CongenitalHeartDisease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'CongenitalHeartDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricOncologyEmergencies', (req, res) => { const r = F.PediatricOncologyEmergencies(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'PediatricOncologyEmergencies', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/InbornErrorsMetabolism', (req, res) => { const r = F.InbornErrorsMetabolism(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'InbornErrorsMetabolism', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricNeurocritical', (req, res) => { const r = F.PediatricNeurocritical(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'PediatricNeurocritical', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricToxicology', (req, res) => { const r = F.PediatricToxicology(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'PediatricToxicology', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
