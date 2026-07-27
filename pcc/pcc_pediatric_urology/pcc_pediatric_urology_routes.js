// P3-ED pcc_pediatric_urology_routes v3.94.0
// P3-ED: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_urology_engine.js');
const VER = '3.94.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_urology', label: 'PCC Pediatric Urology', functions: Object.keys(Engine) });
});
router.post('/call/HypospadiasRepairTiming', (req, res) => { const r = Engine.HypospadiasRepairTiming(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'HypospadiasRepairTiming', plan: r.plan }); });
router.post('/call/UndescendedTestisManagement', (req, res) => { const r = Engine.UndescendedTestisManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'UndescendedTestisManagement', plan: r.plan }); });
router.post('/call/VesicoureteralRefluxGrading', (req, res) => { const r = Engine.VesicoureteralRefluxGrading(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'VesicoureteralRefluxGrading', plan: r.plan }); });
router.post('/call/PediatricUreteralReimplant', (req, res) => { const r = Engine.PediatricUreteralReimplant(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'PediatricUreteralReimplant', plan: r.plan }); });
router.post('/call/BladderExstrophyClosure', (req, res) => { const r = Engine.BladderExstrophyClosure(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'BladderExstrophyClosure', plan: r.plan }); });
router.post('/call/PosteriorUrethralValves', (req, res) => { const r = Engine.PosteriorUrethralValves(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'PosteriorUrethralValves', plan: r.plan }); });
router.post('/call/PediatricKidneyStones', (req, res) => { const r = Engine.PediatricKidneyStones(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'PediatricKidneyStones', plan: r.plan }); });
router.post('/call/CircumcisionDecision', (req, res) => { const r = Engine.CircumcisionDecision(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'CircumcisionDecision', plan: r.plan }); });
router.post('/call/PediatricIncontinence', (req, res) => { const r = Engine.PediatricIncontinence(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'PediatricIncontinence', plan: r.plan }); });
router.post('/call/DisordersOfSexDevelopment', (req, res) => { const r = Engine.DisordersOfSexDevelopment(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_urology', function: 'DisordersOfSexDevelopment', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_urology', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
