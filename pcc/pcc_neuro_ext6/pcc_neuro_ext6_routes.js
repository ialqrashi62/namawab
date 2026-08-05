// P3-EO pcc_neuro_ext6_routes v3.105.0
// P3-EO: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neuro_ext6_engine.js');
const VER = '3.105.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ext6', label: 'PCC Neuro Ext6', functions: Object.keys(F) });
});
router.post('/call/SpinaBifidaEval', (req, res) => { const r = F.SpinaBifidaEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'SpinaBifidaEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AnencephalyEval', (req, res) => { const r = F.AnencephalyEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'AnencephalyEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/EncephaloceleEval', (req, res) => { const r = F.EncephaloceleEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'EncephaloceleEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HoloprosencephalyEval', (req, res) => { const r = F.HoloprosencephalyEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'HoloprosencephalyEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LissencephalyEval', (req, res) => { const r = F.LissencephalyEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'LissencephalyEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PolymicrogyriaEval', (req, res) => { const r = F.PolymicrogyriaEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'PolymicrogyriaEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SchizencephalyEval', (req, res) => { const r = F.SchizencephalyEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'SchizencephalyEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PorencephalyEval', (req, res) => { const r = F.PorencephalyEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'PorencephalyEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HydranencephalyEval', (req, res) => { const r = F.HydranencephalyEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'HydranencephalyEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AicardiSyndrome', (req, res) => { const r = F.AicardiSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext6', function: 'AicardiSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ext6', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
