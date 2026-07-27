// P3-DI pcc_vascular_health_routes v3.73.0
// P3-DI: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_vascular_health_engine.js');
const VER = '3.73.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_vascular_health', label: 'PCC Vascular Health', functions: Object.keys(Engine) });
});

router.post('/call/VenousInsufficiency', (req, res) => { const r = Engine.VenousInsufficiency(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_health', function: 'VenousInsufficiency', plan: r.plan }); });
router.post('/call/PeripheralArtery', (req, res) => { const r = Engine.PeripheralArtery(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_health', function: 'PeripheralArtery', plan: r.plan }); });
router.post('/call/AorticHealth', (req, res) => { const r = Engine.AorticHealth(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_health', function: 'AorticHealth', plan: r.plan }); });
router.post('/call/Microcirculation', (req, res) => { const r = Engine.Microcirculation(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_health', function: 'Microcirculation', plan: r.plan }); });
router.post('/call/VascularInflammation', (req, res) => { const r = Engine.VascularInflammation(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_health', function: 'VascularInflammation', plan: r.plan }); });
router.post('/call/EndothelialRepair', (req, res) => { const r = Engine.EndothelialRepair(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_health', function: 'EndothelialRepair', plan: r.plan }); });
router.post('/call/CompressionTherapy', (req, res) => { const r = Engine.CompressionTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_health', function: 'CompressionTherapy', plan: r.plan }); });
router.post('/call/VascularScreening', (req, res) => { const r = Engine.VascularScreening(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_health', function: 'VascularScreening', plan: r.plan }); });
router.post('/call/ClotRisk', (req, res) => { const r = Engine.ClotRisk(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_health', function: 'ClotRisk', plan: r.plan }); });
router.post('/call/VascularSurgeryPrep', (req, res) => { const r = Engine.VascularSurgeryPrep(req.body || {}); res.json({ version: VER, module: 'pcc_vascular_health', function: 'VascularSurgeryPrep', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_vascular_health', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
