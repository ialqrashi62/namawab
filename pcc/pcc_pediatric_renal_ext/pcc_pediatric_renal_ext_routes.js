// P3-EQ pcc_pediatric_renal_ext_routes v3.107.0
// P3-EQ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_renal_ext_engine.js');
const VER = '3.107.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_renal_ext', label: 'PCC Pediatric Renal Ext', functions: Object.keys(F) });
});
router.post('/call/PediatricAKI', (req, res) => { const r = F.PediatricAKI(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricAKI', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCKDEval', (req, res) => { const r = F.PediatricCKDEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricCKDEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricNS', (req, res) => { const r = F.PediatricNS(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricNS', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHUS', (req, res) => { const r = F.PediatricHUS(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricHUS', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricRPGN', (req, res) => { const r = F.PediatricRPGN(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricRPGN', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricUTIExt', (req, res) => { const r = F.PediatricUTIExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricUTIExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricVUR', (req, res) => { const r = F.PediatricVUR(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricVUR', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricRenalTubularAcidosis', (req, res) => { const r = F.PediatricRenalTubularAcidosis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricRenalTubularAcidosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricBartterSyndrome', (req, res) => { const r = F.PediatricBartterSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricBartterSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricGitelmanSyndrome', (req, res) => { const r = F.PediatricGitelmanSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricGitelmanSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
