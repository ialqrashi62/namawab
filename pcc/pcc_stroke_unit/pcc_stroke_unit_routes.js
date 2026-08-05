// P3-DS pcc_stroke_unit_routes v3.83.0
// P3-DS: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_stroke_unit_engine.js');
const VER = '3.83.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_stroke_unit', label: 'PCC Stroke Unit', functions: Object.keys(F) });
});

router.post('/call/NIHSS', (req, res) => { const r = F.NIHSS(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'NIHSS', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DoorToNeedle', (req, res) => { const r = F.DoorToNeedle(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'DoorToNeedle', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/tPAContraindications', (req, res) => { const r = F.tPAContraindications(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'tPAContraindications', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ICHScore', (req, res) => { const r = F.ICHScore(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'ICHScore', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ASPECTS', (req, res) => { const r = F.ASPECTS(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'ASPECTS', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ABCD2', (req, res) => { const r = F.ABCD2(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'ABCD2', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HASBLED', (req, res) => { const r = F.HASBLED(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'HASBLED', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/StrokeSepsisBundle', (req, res) => { const r = F.StrokeSepsisBundle(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'StrokeSepsisBundle', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DysphagiaScreen', (req, res) => { const r = F.DysphagiaScreen(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'DysphagiaScreen', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SecondaryPrevention', (req, res) => { const r = F.SecondaryPrevention(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'SecondaryPrevention', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_stroke_unit', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
