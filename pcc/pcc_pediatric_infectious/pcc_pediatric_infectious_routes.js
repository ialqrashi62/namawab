// P3-EJ pcc_pediatric_infectious_routes v3.100.0
// P3-EJ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_infectious_engine.js');
const VER = '3.100.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_infectious', label: 'PCC Pediatric Infectious', functions: Object.keys(F) });
});
router.post('/call/PediatricMeningitisEval', (req, res) => { const r = F.PediatricMeningitisEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_infectious', function: 'PediatricMeningitisEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricSepsis', (req, res) => { const r = F.PediatricSepsis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_infectious', function: 'PediatricSepsis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricUTI', (req, res) => { const r = F.PediatricUTI(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_infectious', function: 'PediatricUTI', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPneumoniaEval2', (req, res) => { const r = F.PediatricPneumoniaEval2(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_infectious', function: 'PediatricPneumoniaEval2', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CongenitalInfections', (req, res) => { const r = F.CongenitalInfections(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_infectious', function: 'CongenitalInfections', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricTB', (req, res) => { const r = F.PediatricTB(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_infectious', function: 'PediatricTB', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHIV', (req, res) => { const r = F.PediatricHIV(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_infectious', function: 'PediatricHIV', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricInfluenza', (req, res) => { const r = F.PediatricInfluenza(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_infectious', function: 'PediatricInfluenza', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricSkinSoftTissue', (req, res) => { const r = F.PediatricSkinSoftTissue(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_infectious', function: 'PediatricSkinSoftTissue', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricGastroenteritis', (req, res) => { const r = F.PediatricGastroenteritis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_infectious', function: 'PediatricGastroenteritis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_infectious', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
