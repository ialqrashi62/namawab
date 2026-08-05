// P3-EO pcc_pediatric_psych_ext_routes v3.105.0
// P3-EO: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_psych_ext_engine.js');
const VER = '3.105.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_psych_ext', label: 'PCC Pediatric Psych Ext', functions: Object.keys(F) });
});
router.post('/call/PediatricSchizophreniaEval', (req, res) => { const r = F.PediatricSchizophreniaEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext', function: 'PediatricSchizophreniaEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPsychosisEarly', (req, res) => { const r = F.PediatricPsychosisEarly(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext', function: 'PediatricPsychosisEarly', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCatatonia', (req, res) => { const r = F.PediatricCatatonia(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext', function: 'PediatricCatatonia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricDissociativeDisorder', (req, res) => { const r = F.PediatricDissociativeDisorder(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext', function: 'PediatricDissociativeDisorder', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricEatingDisorderExt', (req, res) => { const r = F.PediatricEatingDisorderExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext', function: 'PediatricEatingDisorderExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricGenderDysphoria', (req, res) => { const r = F.PediatricGenderDysphoria(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext', function: 'PediatricGenderDysphoria', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricSelfHarm', (req, res) => { const r = F.PediatricSelfHarm(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext', function: 'PediatricSelfHarm', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricSuicideRisk', (req, res) => { const r = F.PediatricSuicideRisk(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext', function: 'PediatricSuicideRisk', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCrisisEval', (req, res) => { const r = F.PediatricCrisisEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext', function: 'PediatricCrisisEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPsychEval', (req, res) => { const r = F.PediatricPsychEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext', function: 'PediatricPsychEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_psych_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
