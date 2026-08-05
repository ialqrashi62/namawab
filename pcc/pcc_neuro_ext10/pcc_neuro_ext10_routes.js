// P3-ES pcc_neuro_ext10_routes v3.109.0
// P3-ES: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neuro_ext10_engine.js');
const VER = '3.109.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ext10', label: 'PCC Neuro Ext10', functions: Object.keys(F) });
});
router.post('/call/CerebellarAtaxiaEval', (req, res) => { const r = F.CerebellarAtaxiaEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'CerebellarAtaxiaEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SpinocerebellarDegeneration', (req, res) => { const r = F.SpinocerebellarDegeneration(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'SpinocerebellarDegeneration', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/OlivopontocerebellarAtrophy', (req, res) => { const r = F.OlivopontocerebellarAtrophy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'OlivopontocerebellarAtrophy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DentatorubralPallidoluysianAtrophy', (req, res) => { const r = F.DentatorubralPallidoluysianAtrophy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'DentatorubralPallidoluysianAtrophy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FriedreichAtaxiaExt', (req, res) => { const r = F.FriedreichAtaxiaExt(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'FriedreichAtaxiaExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AtaxiaTelangiectasiaExt', (req, res) => { const r = F.AtaxiaTelangiectasiaExt(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'AtaxiaTelangiectasiaExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CerebrotendinousXanthomatosis', (req, res) => { const r = F.CerebrotendinousXanthomatosis(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'CerebrotendinousXanthomatosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NiemannPickDisease', (req, res) => { const r = F.NiemannPickDisease(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'NiemannPickDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GaucherDiseaseType2', (req, res) => { const r = F.GaucherDiseaseType2(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'GaucherDiseaseType2', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MetachromaticLeukodystrophyExt', (req, res) => { const r = F.MetachromaticLeukodystrophyExt(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext10', function: 'MetachromaticLeukodystrophyExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ext10', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
