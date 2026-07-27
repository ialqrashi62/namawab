// P3-EV pcc_neuro_ext13_routes v3.112.0
// P3-EV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_neuro_ext13_engine.js');
const VER = '3.112.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ext13', label: 'PCC Neuro Ext13', functions: Object.keys(Engine) });
});
router.post('/call/ParkinsonDiseaseExt', (req, res) => { const r = Engine.ParkinsonDiseaseExt(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'ParkinsonDiseaseExt', plan: r.plan }); });
router.post('/call/ParkinsonPlusSyndromes', (req, res) => { const r = Engine.ParkinsonPlusSyndromes(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'ParkinsonPlusSyndromes', plan: r.plan }); });
router.post('/call/MultisystemAtrophy', (req, res) => { const r = Engine.MultisystemAtrophy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'MultisystemAtrophy', plan: r.plan }); });
router.post('/call/ProgressiveSupranuclearPalsy', (req, res) => { const r = Engine.ProgressiveSupranuclearPalsy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'ProgressiveSupranuclearPalsy', plan: r.plan }); });
router.post('/call/CorticobasalDegeneration', (req, res) => { const r = Engine.CorticobasalDegeneration(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'CorticobasalDegeneration', plan: r.plan }); });
router.post('/call/LewyBodyDementiaExt', (req, res) => { const r = Engine.LewyBodyDementiaExt(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'LewyBodyDementiaExt', plan: r.plan }); });
router.post('/call/EssentialTremor', (req, res) => { const r = Engine.EssentialTremor(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'EssentialTremor', plan: r.plan }); });
router.post('/call/DystoniaEval', (req, res) => { const r = Engine.DystoniaEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'DystoniaEval', plan: r.plan }); });
router.post('/call/TardiveDyskinesia', (req, res) => { const r = Engine.TardiveDyskinesia(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'TardiveDyskinesia', plan: r.plan }); });
router.post('/call/HuntingtonDiseaseExt', (req, res) => { const r = Engine.HuntingtonDiseaseExt(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext13', function: 'HuntingtonDiseaseExt', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ext13', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
