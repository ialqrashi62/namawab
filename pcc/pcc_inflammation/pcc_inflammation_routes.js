// P3-DF pcc_inflammation_routes v3.70.0
// P3-DF: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_inflammation_engine.js');
const VER = '3.70.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_inflammation', label: 'PCC Inflammation', functions: Object.keys(Engine) });
});

router.post('/call/CRPTrend', (req, res) => { const r = Engine.CRPTrend(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'CRPTrend', plan: r.plan }); });
router.post('/call/ESRPattern', (req, res) => { const r = Engine.ESRPattern(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'ESRPattern', plan: r.plan }); });
router.post('/call/CytokineStorm', (req, res) => { const r = Engine.CytokineStorm(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'CytokineStorm', plan: r.plan }); });
router.post('/call/ChronicInflammation', (req, res) => { const r = Engine.ChronicInflammation(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'ChronicInflammation', plan: r.plan }); });
router.post('/call/Neuroinflammation', (req, res) => { const r = Engine.Neuroinflammation(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'Neuroinflammation', plan: r.plan }); });
router.post('/call/CardiovascularInflammation', (req, res) => { const r = Engine.CardiovascularInflammation(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'CardiovascularInflammation', plan: r.plan }); });
router.post('/call/GutInflammation', (req, res) => { const r = Engine.GutInflammation(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'GutInflammation', plan: r.plan }); });
router.post('/call/AutoimmuneFlare', (req, res) => { const r = Engine.AutoimmuneFlare(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'AutoimmuneFlare', plan: r.plan }); });
router.post('/call/AntiInflammatoryDiet', (req, res) => { const r = Engine.AntiInflammatoryDiet(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'AntiInflammatoryDiet', plan: r.plan }); });
router.post('/call/InflammationResolution', (req, res) => { const r = Engine.InflammationResolution(req.body || {}); res.json({ version: VER, module: 'pcc_inflammation', function: 'InflammationResolution', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_inflammation', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
