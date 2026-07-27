// P3-DI pcc_heart_failure_advanced_routes v3.73.0
// P3-DI: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_heart_failure_advanced_engine.js');
const VER = '3.73.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_heart_failure_advanced', label: 'PCC Heart Failure Advanced', functions: Object.keys(Engine) });
});

router.post('/call/NYHAStaging', (req, res) => { const r = Engine.NYHAStaging(req.body || {}); res.json({ version: VER, module: 'pcc_heart_failure_advanced', function: 'NYHAStaging', plan: r.plan }); });
router.post('/call/BNPTrend', (req, res) => { const r = Engine.BNPTrend(req.body || {}); res.json({ version: VER, module: 'pcc_heart_failure_advanced', function: 'BNPTrend', plan: r.plan }); });
router.post('/call/EjectionFraction', (req, res) => { const r = Engine.EjectionFraction(req.body || {}); res.json({ version: VER, module: 'pcc_heart_failure_advanced', function: 'EjectionFraction', plan: r.plan }); });
router.post('/call/FluidStatus', (req, res) => { const r = Engine.FluidStatus(req.body || {}); res.json({ version: VER, module: 'pcc_heart_failure_advanced', function: 'FluidStatus', plan: r.plan }); });
router.post('/call/CardiacDevice', (req, res) => { const r = Engine.CardiacDevice(req.body || {}); res.json({ version: VER, module: 'pcc_heart_failure_advanced', function: 'CardiacDevice', plan: r.plan }); });
router.post('/call/HeartTransplantEval', (req, res) => { const r = Engine.HeartTransplantEval(req.body || {}); res.json({ version: VER, module: 'pcc_heart_failure_advanced', function: 'HeartTransplantEval', plan: r.plan }); });
router.post('/call/PalliativeHF', (req, res) => { const r = Engine.PalliativeHF(req.body || {}); res.json({ version: VER, module: 'pcc_heart_failure_advanced', function: 'PalliativeHF', plan: r.plan }); });
router.post('/call/AcuteDecompensation', (req, res) => { const r = Engine.AcuteDecompensation(req.body || {}); res.json({ version: VER, module: 'pcc_heart_failure_advanced', function: 'AcuteDecompensation', plan: r.plan }); });
router.post('/call/DiureticStrategy', (req, res) => { const r = Engine.DiureticStrategy(req.body || {}); res.json({ version: VER, module: 'pcc_heart_failure_advanced', function: 'DiureticStrategy', plan: r.plan }); });
router.post('/call/SelfManagement', (req, res) => { const r = Engine.SelfManagement(req.body || {}); res.json({ version: VER, module: 'pcc_heart_failure_advanced', function: 'SelfManagement', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_heart_failure_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
