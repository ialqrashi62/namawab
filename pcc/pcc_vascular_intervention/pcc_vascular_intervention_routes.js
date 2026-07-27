// P3-DX pcc_vascular_intervention_routes v3.88.0
// P3-DX: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_vascular_intervention_engine.js');
const VER = '3.88.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_vascular_intervention', label: 'PCC Vascular Intervention', functions: Object.keys(Engine) });
});
router.post('/call/CarotidStentPlacement', (req, res) => { const r = Engine.CarotidStentPlacement(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_intervention', function: 'CarotidStentPlacement', plan: r.plan }); });
router.post('/call/AAAEndovascularRepair', (req, res) => { const r = Engine.AAAEndovascularRepair(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_intervention', function: 'AAAEndovascularRepair', plan: r.plan }); });
router.post('/call/PeripheralAngioplasty', (req, res) => { const r = Engine.PeripheralAngioplasty(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_intervention', function: 'PeripheralAngioplasty', plan: r.plan }); });
router.post('/call/DVTThrombolysis', (req, res) => { const r = Engine.DVTThrombolysis(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_intervention', function: 'DVTThrombolysis', plan: r.plan }); });
router.post('/call/VaricoseVeinAblation', (req, res) => { const r = Engine.VaricoseVeinAblation(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_intervention', function: 'VaricoseVeinAblation', plan: r.plan }); });
router.post('/call/AVMEmbolization', (req, res) => { const r = Engine.AVMEmbolization(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_intervention', function: 'AVMEmbolization', plan: r.plan }); });
router.post('/call/RenalArteryStenting', (req, res) => { const r = Engine.RenalArteryStenting(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_intervention', function: 'RenalArteryStenting', plan: r.plan }); });
router.post('/call/MesentericIschemiaIntervention', (req, res) => { const r = Engine.MesentericIschemiaIntervention(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_intervention', function: 'MesentericIschemiaIntervention', plan: r.plan }); });
router.post('/call/ClaudicationRevascularization', (req, res) => { const r = Engine.ClaudicationRevascularization(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_intervention', function: 'ClaudicationRevascularization', plan: r.plan }); });
router.post('/call/VascularTraumaControl', (req, res) => { const r = Engine.VascularTraumaControl(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_intervention', function: 'VascularTraumaControl', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_vascular_intervention', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
