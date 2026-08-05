// P3-DI pcc_heart_failure_advanced_routes v3.316.32 (Phase 1A clinical-grade)
'use strict';
const express = require('express');
const F = require('./pcc_heart_failure_advanced_engine.js');
const VER = '3.316.32';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_heart_failure_advanced', label: 'PCC Heart Failure Advanced', functions: Object.keys(F) });
});

const wrap = (name) => (req, res) => {
  try {
    const r = F[name](req.body || {});
    res.json({ version: VER, module: 'pcc_heart_failure_advanced', function: name, result: r });
  } catch (e) {
    res.status(400).json({ error: e.message, function: name });
  }
};

router.post('/call/NYHAStaging', wrap('NYHAStaging'));
router.post('/call/BNPTrend', wrap('BNPTrend'));
router.post('/call/EjectionFraction', wrap('EjectionFraction'));
router.post('/call/FluidStatus', wrap('FluidStatus'));
router.post('/call/CardiacDevice', wrap('CardiacDevice'));
router.post('/call/HeartTransplantEval', wrap('HeartTransplantEval'));
router.post('/call/PalliativeHF', wrap('PalliativeHF'));
router.post('/call/AcuteDecompensation', wrap('AcuteDecompensation'));
router.post('/call/DiureticStrategy', wrap('DiureticStrategy'));
router.post('/call/SelfManagement', wrap('SelfManagement'));

router.post('/record', (req, res) => {
  const { tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  if (!fn || !F[fn]) return res.status(400).json({ error: 'fn required and must be valid' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_heart_failure_advanced', function: fn, result: r, recorded: true, tenant_id, decisionId: decisionId || null });
});

module.exports = router;