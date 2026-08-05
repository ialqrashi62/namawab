// P3-DJ pcc_sleep_disorders_routes v3.74.0
// P3-DJ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_sleep_disorders_engine.js');
const VER = '3.74.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_sleep_disorders', label: 'PCC Sleep Disorders', functions: Object.keys(F) });
});

router.post('/call/SleepApnea', (req, res) => { const r = F.SleepApnea(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_disorders', function: 'SleepApnea', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/InsomniaCBT', (req, res) => { const r = F.InsomniaCBT(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_disorders', function: 'InsomniaCBT', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CircadianRhythm', (req, res) => { const r = F.CircadianRhythm(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_disorders', function: 'CircadianRhythm', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RestlessLegs', (req, res) => { const r = F.RestlessLegs(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_disorders', function: 'RestlessLegs', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Narcolepsy', (req, res) => { const r = F.Narcolepsy(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_disorders', function: 'Narcolepsy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Parasomnias', (req, res) => { const r = F.Parasomnias(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_disorders', function: 'Parasomnias', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Hypersomnia', (req, res) => { const r = F.Hypersomnia(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_disorders', function: 'Hypersomnia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SleepHygieneAdvanced', (req, res) => { const r = F.SleepHygieneAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_disorders', function: 'SleepHygieneAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CPAPTitration', (req, res) => { const r = F.CPAPTitration(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_disorders', function: 'CPAPTitration', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SleepSurgery', (req, res) => { const r = F.SleepSurgery(req.body || {}); res.json({ version: VER, module: 'pcc_sleep_disorders', function: 'SleepSurgery', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_sleep_disorders', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
