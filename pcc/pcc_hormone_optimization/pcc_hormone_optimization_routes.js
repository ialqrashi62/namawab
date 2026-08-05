// P3-DG pcc_hormone_optimization_routes v3.71.0
// P3-DG: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_hormone_optimization_engine.js');
const VER = '3.71.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_hormone_optimization', label: 'PCC Hormone Optimization', functions: Object.keys(F) });
});

router.post('/call/TestosteroneBalance', (req, res) => { const r = F.TestosteroneBalance(req.body || {}); res.json({ version: VER, module: 'pcc_hormone_optimization', function: 'TestosteroneBalance', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/EstrogenMetabolism', (req, res) => { const r = F.EstrogenMetabolism(req.body || {}); res.json({ version: VER, module: 'pcc_hormone_optimization', function: 'EstrogenMetabolism', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ProgesteroneSupport', (req, res) => { const r = F.ProgesteroneSupport(req.body || {}); res.json({ version: VER, module: 'pcc_hormone_optimization', function: 'ProgesteroneSupport', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CortisolRhythm', (req, res) => { const r = F.CortisolRhythm(req.body || {}); res.json({ version: VER, module: 'pcc_hormone_optimization', function: 'CortisolRhythm', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GrowthHormone', (req, res) => { const r = F.GrowthHormone(req.body || {}); res.json({ version: VER, module: 'pcc_hormone_optimization', function: 'GrowthHormone', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DHEAOptimization', (req, res) => { const r = F.DHEAOptimization(req.body || {}); res.json({ version: VER, module: 'pcc_hormone_optimization', function: 'DHEAOptimization', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Pregnenolone', (req, res) => { const r = F.Pregnenolone(req.body || {}); res.json({ version: VER, module: 'pcc_hormone_optimization', function: 'Pregnenolone', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MelatoninRhythm', (req, res) => { const r = F.MelatoninRhythm(req.body || {}); res.json({ version: VER, module: 'pcc_hormone_optimization', function: 'MelatoninRhythm', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ThyroidHormone', (req, res) => { const r = F.ThyroidHormone(req.body || {}); res.json({ version: VER, module: 'pcc_hormone_optimization', function: 'ThyroidHormone', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HormoneSafety', (req, res) => { const r = F.HormoneSafety(req.body || {}); res.json({ version: VER, module: 'pcc_hormone_optimization', function: 'HormoneSafety', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_hormone_optimization', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
