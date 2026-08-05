// P3-EK pcc_pediatric_sleep_routes v3.101.0
// P3-EK: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_sleep_engine.js');
const VER = '3.101.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_sleep', label: 'PCC Pediatric Sleep', functions: Object.keys(F) });
});
router.post('/call/PediatricSleepApnea', (req, res) => { const r = F.PediatricSleepApnea(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_sleep', function: 'PediatricSleepApnea', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricInsomnia', (req, res) => { const r = F.PediatricInsomnia(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_sleep', function: 'PediatricInsomnia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricNarcolepsy', (req, res) => { const r = F.PediatricNarcolepsy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_sleep', function: 'PediatricNarcolepsy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricParasomnias', (req, res) => { const r = F.PediatricParasomnias(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_sleep', function: 'PediatricParasomnias', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCircadianDisorder', (req, res) => { const r = F.PediatricCircadianDisorder(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_sleep', function: 'PediatricCircadianDisorder', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricRestlessLeg', (req, res) => { const r = F.PediatricRestlessLeg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_sleep', function: 'PediatricRestlessLeg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricSleepDisorderedBreathing', (req, res) => { const r = F.PediatricSleepDisorderedBreathing(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_sleep', function: 'PediatricSleepDisorderedBreathing', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricNightTerrors', (req, res) => { const r = F.PediatricNightTerrors(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_sleep', function: 'PediatricNightTerrors', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricBedwetting', (req, res) => { const r = F.PediatricBedwetting(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_sleep', function: 'PediatricBedwetting', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricSleepHygiene', (req, res) => { const r = F.PediatricSleepHygiene(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_sleep', function: 'PediatricSleepHygiene', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_sleep', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
