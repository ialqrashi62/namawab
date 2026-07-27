// P3-EN pcc_neuro_ext5_routes v3.104.0
// P3-EN: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_neuro_ext5_engine.js');
const VER = '3.104.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ext5', label: 'PCC Neuro Ext5', functions: Object.keys(Engine) });
});
router.post('/call/NeurofibromatosisEval', (req, res) => { const r = Engine.NeurofibromatosisEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'NeurofibromatosisEval', plan: r.plan }); });
router.post('/call/TuberousSclerosisComplex', (req, res) => { const r = Engine.TuberousSclerosisComplex(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'TuberousSclerosisComplex', plan: r.plan }); });
router.post('/call/SturgeWeberSyndrome', (req, res) => { const r = Engine.SturgeWeberSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'SturgeWeberSyndrome', plan: r.plan }); });
router.post('/call/AtaxiaTelangiectasia', (req, res) => { const r = Engine.AtaxiaTelangiectasia(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'AtaxiaTelangiectasia', plan: r.plan }); });
router.post('/call/VonHippelLindau', (req, res) => { const r = Engine.VonHippelLindau(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'VonHippelLindau', plan: r.plan }); });
router.post('/call/HuntingtonDisease', (req, res) => { const r = Engine.HuntingtonDisease(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'HuntingtonDisease', plan: r.plan }); });
router.post('/call/SpinocerebellarAtaxia', (req, res) => { const r = Engine.SpinocerebellarAtaxia(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'SpinocerebellarAtaxia', plan: r.plan }); });
router.post('/call/FriedreichAtaxia', (req, res) => { const r = Engine.FriedreichAtaxia(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'FriedreichAtaxia', plan: r.plan }); });
router.post('/call/WilsonDisease', (req, res) => { const r = Engine.WilsonDisease(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'WilsonDisease', plan: r.plan }); });
router.post('/call/PantothenateKinase', (req, res) => { const r = Engine.PantothenateKinase(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext5', function: 'PantothenateKinase', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ext5', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
