// P3-EL pcc_pediatric_behavior_routes v3.102.0
// P3-EL: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_behavior_engine.js');
const VER = '3.102.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_behavior', label: 'PCC Pediatric Behavior', functions: Object.keys(F) });
});
router.post('/call/AutismSpectrumEval', (req, res) => { const r = F.AutismSpectrumEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'AutismSpectrumEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ADHDAssessment', (req, res) => { const r = F.ADHDAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'ADHDAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricAnxiety', (req, res) => { const r = F.PediatricAnxiety(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'PediatricAnxiety', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricDepression', (req, res) => { const r = F.PediatricDepression(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'PediatricDepression', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricOCD', (req, res) => { const r = F.PediatricOCD(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'PediatricOCD', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricBipolarEval', (req, res) => { const r = F.PediatricBipolarEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'PediatricBipolarEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricConductDisorder', (req, res) => { const r = F.PediatricConductDisorder(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'PediatricConductDisorder', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricOppositionalDefiant', (req, res) => { const r = F.PediatricOppositionalDefiant(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'PediatricOppositionalDefiant', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricTicDisorders', (req, res) => { const r = F.PediatricTicDisorders(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'PediatricTicDisorders', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricSelectiveMutism', (req, res) => { const r = F.PediatricSelectiveMutism(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_behavior', function: 'PediatricSelectiveMutism', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_behavior', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
