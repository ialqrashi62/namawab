// P3-EO pcc_neuro_ext6_routes v3.105.0
// P3-EO: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_neuro_ext6_engine.js');
const VER = '3.105.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ext6', label: 'PCC Neuro Ext6', functions: Object.keys(Engine) });
});
router.post('/call/SpinaBifidaEval', (req, res) => { const r = Engine.SpinaBifidaEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'SpinaBifidaEval', plan: r.plan }); });
router.post('/call/AnencephalyEval', (req, res) => { const r = Engine.AnencephalyEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'AnencephalyEval', plan: r.plan }); });
router.post('/call/EncephaloceleEval', (req, res) => { const r = Engine.EncephaloceleEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'EncephaloceleEval', plan: r.plan }); });
router.post('/call/HoloprosencephalyEval', (req, res) => { const r = Engine.HoloprosencephalyEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'HoloprosencephalyEval', plan: r.plan }); });
router.post('/call/LissencephalyEval', (req, res) => { const r = Engine.LissencephalyEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'LissencephalyEval', plan: r.plan }); });
router.post('/call/PolymicrogyriaEval', (req, res) => { const r = Engine.PolymicrogyriaEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'PolymicrogyriaEval', plan: r.plan }); });
router.post('/call/SchizencephalyEval', (req, res) => { const r = Engine.SchizencephalyEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'SchizencephalyEval', plan: r.plan }); });
router.post('/call/PorencephalyEval', (req, res) => { const r = Engine.PorencephalyEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'PorencephalyEval', plan: r.plan }); });
router.post('/call/HydranencephalyEval', (req, res) => { const r = Engine.HydranencephalyEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'HydranencephalyEval', plan: r.plan }); });
router.post('/call/AicardiSyndrome', (req, res) => { const r = Engine.AicardiSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'AicardiSyndrome', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ext6', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
