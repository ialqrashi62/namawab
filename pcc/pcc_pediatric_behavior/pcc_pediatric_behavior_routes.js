// P3-EL pcc_pediatric_behavior_routes v3.102.0
// P3-EL: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_behavior_engine.js');
const VER = '3.102.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_behavior', label: 'PCC Pediatric Behavior', functions: Object.keys(Engine) });
});
router.post('/call/AutismSpectrumEval', (req, res) => { const r = Engine.AutismSpectrumEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'AutismSpectrumEval', plan: r.plan }); });
router.post('/call/ADHDAssessment', (req, res) => { const r = Engine.ADHDAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'ADHDAssessment', plan: r.plan }); });
router.post('/call/PediatricAnxiety', (req, res) => { const r = Engine.PediatricAnxiety(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'PediatricAnxiety', plan: r.plan }); });
router.post('/call/PediatricDepression', (req, res) => { const r = Engine.PediatricDepression(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'PediatricDepression', plan: r.plan }); });
router.post('/call/PediatricOCD', (req, res) => { const r = Engine.PediatricOCD(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'PediatricOCD', plan: r.plan }); });
router.post('/call/PediatricBipolarEval', (req, res) => { const r = Engine.PediatricBipolarEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'PediatricBipolarEval', plan: r.plan }); });
router.post('/call/PediatricConductDisorder', (req, res) => { const r = Engine.PediatricConductDisorder(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'PediatricConductDisorder', plan: r.plan }); });
router.post('/call/PediatricOppositionalDefiant', (req, res) => { const r = Engine.PediatricOppositionalDefiant(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'PediatricOppositionalDefiant', plan: r.plan }); });
router.post('/call/PediatricTicDisorders', (req, res) => { const r = Engine.PediatricTicDisorders(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'PediatricTicDisorders', plan: r.plan }); });
router.post('/call/PediatricSelectiveMutism', (req, res) => { const r = Engine.PediatricSelectiveMutism(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'PediatricSelectiveMutism', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_behavior', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
