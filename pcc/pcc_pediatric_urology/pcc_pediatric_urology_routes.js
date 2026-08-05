// P3-ED pcc_pediatric_urology_routes v3.94.0
// P3-ED: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_urology_engine.js');
const VER = '3.94.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_urology', label: 'PCC Pediatric Urology', functions: Object.keys(F) });
});
router.post('/call/HypospadiasRepairTiming', (req, res) => { const r = F.HypospadiasRepairTiming(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'HypospadiasRepairTiming', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/UndescendedTestisManagement', (req, res) => { const r = F.UndescendedTestisManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'UndescendedTestisManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VesicoureteralRefluxGrading', (req, res) => { const r = F.VesicoureteralRefluxGrading(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'VesicoureteralRefluxGrading', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricUreteralReimplant', (req, res) => { const r = F.PediatricUreteralReimplant(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'PediatricUreteralReimplant', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BladderExstrophyClosure', (req, res) => { const r = F.BladderExstrophyClosure(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'BladderExstrophyClosure', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PosteriorUrethralValves', (req, res) => { const r = F.PosteriorUrethralValves(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'PosteriorUrethralValves', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricKidneyStones', (req, res) => { const r = F.PediatricKidneyStones(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'PediatricKidneyStones', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CircumcisionDecision', (req, res) => { const r = F.CircumcisionDecision(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'CircumcisionDecision', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricIncontinence', (req, res) => { const r = F.PediatricIncontinence(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'PediatricIncontinence', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DisordersOfSexDevelopment', (req, res) => { const r = F.DisordersOfSexDevelopment(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'DisordersOfSexDevelopment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_urology', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
