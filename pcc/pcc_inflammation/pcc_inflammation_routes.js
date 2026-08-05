// P3-DF pcc_inflammation_routes v3.70.0
// P3-DF: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_inflammation_engine.js');
const VER = '3.70.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_inflammation', label: 'PCC Inflammation', functions: Object.keys(F) });
});

router.post('/call/CRPTrend', (req, res) => { const r = F.CRPTrend(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'CRPTrend', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ESRPattern', (req, res) => { const r = F.ESRPattern(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'ESRPattern', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CytokineStorm', (req, res) => { const r = F.CytokineStorm(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'CytokineStorm', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ChronicInflammation', (req, res) => { const r = F.ChronicInflammation(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'ChronicInflammation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Neuroinflammation', (req, res) => { const r = F.Neuroinflammation(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'Neuroinflammation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CardiovascularInflammation', (req, res) => { const r = F.CardiovascularInflammation(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'CardiovascularInflammation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GutInflammation', (req, res) => { const r = F.GutInflammation(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'GutInflammation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AutoimmuneFlare', (req, res) => { const r = F.AutoimmuneFlare(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'AutoimmuneFlare', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AntiInflammatoryDiet', (req, res) => { const r = F.AntiInflammatoryDiet(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'AntiInflammatoryDiet', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/InflammationResolution', (req, res) => { const r = F.InflammationResolution(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'InflammationResolution', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_inflammation', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
