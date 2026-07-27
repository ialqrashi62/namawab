// P3-ES pcc_neuro_ext10_routes v3.109.0
// P3-ES: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_neuro_ext10_engine.js');
const VER = '3.109.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ext10', label: 'PCC Neuro Ext10', functions: Object.keys(Engine) });
});
router.post('/call/CerebellarAtaxiaEval', (req, res) => { const r = Engine.CerebellarAtaxiaEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'CerebellarAtaxiaEval', plan: r.plan }); });
router.post('/call/SpinocerebellarDegeneration', (req, res) => { const r = Engine.SpinocerebellarDegeneration(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'SpinocerebellarDegeneration', plan: r.plan }); });
router.post('/call/OlivopontocerebellarAtrophy', (req, res) => { const r = Engine.OlivopontocerebellarAtrophy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'OlivopontocerebellarAtrophy', plan: r.plan }); });
router.post('/call/DentatorubralPallidoluysianAtrophy', (req, res) => { const r = Engine.DentatorubralPallidoluysianAtrophy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'DentatorubralPallidoluysianAtrophy', plan: r.plan }); });
router.post('/call/FriedreichAtaxiaExt', (req, res) => { const r = Engine.FriedreichAtaxiaExt(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'FriedreichAtaxiaExt', plan: r.plan }); });
router.post('/call/AtaxiaTelangiectasiaExt', (req, res) => { const r = Engine.AtaxiaTelangiectasiaExt(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'AtaxiaTelangiectasiaExt', plan: r.plan }); });
router.post('/call/CerebrotendinousXanthomatosis', (req, res) => { const r = Engine.CerebrotendinousXanthomatosis(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'CerebrotendinousXanthomatosis', plan: r.plan }); });
router.post('/call/NiemannPickDisease', (req, res) => { const r = Engine.NiemannPickDisease(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'NiemannPickDisease', plan: r.plan }); });
router.post('/call/GaucherDiseaseType2', (req, res) => { const r = Engine.GaucherDiseaseType2(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'GaucherDiseaseType2', plan: r.plan }); });
router.post('/call/MetachromaticLeukodystrophyExt', (req, res) => { const r = Engine.MetachromaticLeukodystrophyExt(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'MetachromaticLeukodystrophyExt', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ext10', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
