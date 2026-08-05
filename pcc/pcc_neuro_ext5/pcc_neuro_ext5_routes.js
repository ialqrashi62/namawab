// P3-EN pcc_neuro_ext5_routes v3.104.0
// P3-EN: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neuro_ext5_engine.js');
const VER = '3.104.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ext5', label: 'PCC Neuro Ext5', functions: Object.keys(F) });
});
router.post('/call/NeurofibromatosisEval', (req, res) => { const r = F.NeurofibromatosisEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'NeurofibromatosisEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TuberousSclerosisComplex', (req, res) => { const r = F.TuberousSclerosisComplex(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'TuberousSclerosisComplex', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SturgeWeberSyndrome', (req, res) => { const r = F.SturgeWeberSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'SturgeWeberSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AtaxiaTelangiectasia', (req, res) => { const r = F.AtaxiaTelangiectasia(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'AtaxiaTelangiectasia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VonHippelLindau', (req, res) => { const r = F.VonHippelLindau(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'VonHippelLindau', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HuntingtonDisease', (req, res) => { const r = F.HuntingtonDisease(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'HuntingtonDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SpinocerebellarAtaxia', (req, res) => { const r = F.SpinocerebellarAtaxia(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'SpinocerebellarAtaxia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FriedreichAtaxia', (req, res) => { const r = F.FriedreichAtaxia(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'FriedreichAtaxia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/WilsonDisease', (req, res) => { const r = F.WilsonDisease(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'WilsonDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PantothenateKinase', (req, res) => { const r = F.PantothenateKinase(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'PantothenateKinase', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ext5', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
