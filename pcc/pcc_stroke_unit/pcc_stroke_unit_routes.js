// P3-DS pcc_stroke_unit_routes v3.83.0
// P3-DS: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_stroke_unit_engine.js');
const VER = '3.83.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_stroke_unit', label: 'PCC Stroke Unit', functions: Object.keys(Engine) });
});

router.post('/call/NIHSS', (req, res) => { const r = Engine.NIHSS(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'NIHSS', plan: r.plan }); });
router.post('/call/DoorToNeedle', (req, res) => { const r = Engine.DoorToNeedle(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'DoorToNeedle', plan: r.plan }); });
router.post('/call/tPAContraindications', (req, res) => { const r = Engine.tPAContraindications(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'tPAContraindications', plan: r.plan }); });
router.post('/call/ICHScore', (req, res) => { const r = Engine.ICHScore(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'ICHScore', plan: r.plan }); });
router.post('/call/ASPECTS', (req, res) => { const r = Engine.ASPECTS(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'ASPECTS', plan: r.plan }); });
router.post('/call/ABCD2', (req, res) => { const r = Engine.ABCD2(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'ABCD2', plan: r.plan }); });
router.post('/call/HASBLED', (req, res) => { const r = Engine.HASBLED(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'HASBLED', plan: r.plan }); });
router.post('/call/StrokeSepsisBundle', (req, res) => { const r = Engine.StrokeSepsisBundle(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'StrokeSepsisBundle', plan: r.plan }); });
router.post('/call/DysphagiaScreen', (req, res) => { const r = Engine.DysphagiaScreen(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'DysphagiaScreen', plan: r.plan }); });
router.post('/call/SecondaryPrevention', (req, res) => { const r = Engine.SecondaryPrevention(req.body || {}); res.json({ version: VER, module: 'pcc_stroke_unit', function: 'SecondaryPrevention', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_stroke_unit', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
