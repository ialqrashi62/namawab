// P3-EE pcc_pediatric_neuro_routes v3.95.0
// P3-EE: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_neuro_engine.js');
const VER = '3.95.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_neuro', label: 'PCC Pediatric Neuro', functions: Object.keys(F) });
});
router.post('/call/PediatricEpilepsySyndrome', (req, res) => { const r = F.PediatricEpilepsySyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro', function: 'PediatricEpilepsySyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CerebralPalsyClassification', (req, res) => { const r = F.CerebralPalsyClassification(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro', function: 'CerebralPalsyClassification', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricStrokeWorkup', (req, res) => { const r = F.PediatricStrokeWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro', function: 'PediatricStrokeWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeurocutaneousSyndrome', (req, res) => { const r = F.NeurocutaneousSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro', function: 'NeurocutaneousSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricMigraineManagement', (req, res) => { const r = F.PediatricMigraineManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro', function: 'PediatricMigraineManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FebrileSeizureRisk', (req, res) => { const r = F.FebrileSeizureRisk(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro', function: 'FebrileSeizureRisk', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeurodegenerativePediatric', (req, res) => { const r = F.NeurodegenerativePediatric(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro', function: 'NeurodegenerativePediatric', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricMovementDisorder', (req, res) => { const r = F.PediatricMovementDisorder(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro', function: 'PediatricMovementDisorder', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricNeurometabolic', (req, res) => { const r = F.PediatricNeurometabolic(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro', function: 'PediatricNeurometabolic', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CNSDevelopmentalDelay', (req, res) => { const r = F.CNSDevelopmentalDelay(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro', function: 'CNSDevelopmentalDelay', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_neuro', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
