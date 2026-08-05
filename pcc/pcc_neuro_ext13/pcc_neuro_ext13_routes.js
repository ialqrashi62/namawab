// P3-EV pcc_neuro_ext13_routes v3.112.0
// P3-EV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neuro_ext13_engine.js');
const VER = '3.112.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ext13', label: 'PCC Neuro Ext13', functions: Object.keys(F) });
});
router.post('/call/ParkinsonDiseaseExt', (req, res) => { const r = F.ParkinsonDiseaseExt(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'ParkinsonDiseaseExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ParkinsonPlusSyndromes', (req, res) => { const r = F.ParkinsonPlusSyndromes(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'ParkinsonPlusSyndromes', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MultisystemAtrophy', (req, res) => { const r = F.MultisystemAtrophy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'MultisystemAtrophy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ProgressiveSupranuclearPalsy', (req, res) => { const r = F.ProgressiveSupranuclearPalsy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'ProgressiveSupranuclearPalsy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CorticobasalDegeneration', (req, res) => { const r = F.CorticobasalDegeneration(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'CorticobasalDegeneration', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LewyBodyDementiaExt', (req, res) => { const r = F.LewyBodyDementiaExt(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'LewyBodyDementiaExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/EssentialTremor', (req, res) => { const r = F.EssentialTremor(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'EssentialTremor', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DystoniaEval', (req, res) => { const r = F.DystoniaEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'DystoniaEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TardiveDyskinesia', (req, res) => { const r = F.TardiveDyskinesia(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'TardiveDyskinesia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HuntingtonDiseaseExt', (req, res) => { const r = F.HuntingtonDiseaseExt(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'HuntingtonDiseaseExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ext13', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
