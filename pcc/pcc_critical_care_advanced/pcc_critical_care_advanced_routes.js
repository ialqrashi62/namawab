// P3-DL pcc_critical_care_advanced_routes v3.76.0
// P3-DL: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_critical_care_advanced_engine.js');
const VER = '3.76.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_critical_care_advanced', label: 'PCC Critical Care Advanced', functions: Object.keys(Engine) });
});

router.post('/call/ShockIndex', (req, res) => { const r = Engine.ShockIndex(req.body || {}); res.json({ version: VER, module: 'pcc_critical_care_advanced', function: 'ShockIndex', plan: r.plan }); });
router.post('/call/LactateClearance', (req, res) => { const r = Engine.LactateClearance(req.body || {}); res.json({ version: VER, module: 'pcc_critical_care_advanced', function: 'LactateClearance', plan: r.plan }); });
router.post('/call/Scvo2Monitoring', (req, res) => { const r = Engine.Scvo2Monitoring(req.body || {}); res.json({ version: VER, module: 'pcc_critical_care_advanced', function: 'Scvo2Monitoring', plan: r.plan }); });
router.post('/call/Microcirculation', (req, res) => { const r = Engine.Microcirculation(req.body || {}); res.json({ version: VER, module: 'pcc_critical_care_advanced', function: 'Microcirculation', plan: r.plan }); });
router.post('/call/CuffPressure', (req, res) => { const r = Engine.CuffPressure(req.body || {}); res.json({ version: VER, module: 'pcc_critical_care_advanced', function: 'CuffPressure', plan: r.plan }); });
router.post('/call/PronePositioning', (req, res) => { const r = Engine.PronePositioning(req.body || {}); res.json({ version: VER, module: 'pcc_critical_care_advanced', function: 'PronePositioning', plan: r.plan }); });
router.post('/call/ECMOIndication', (req, res) => { const r = Engine.ECMOIndication(req.body || {}); res.json({ version: VER, module: 'pcc_critical_care_advanced', function: 'ECMOIndication', plan: r.plan }); });
router.post('/call/CRRTDosing', (req, res) => { const r = Engine.CRRTDosing(req.body || {}); res.json({ version: VER, module: 'pcc_critical_care_advanced', function: 'CRRTDosing', plan: r.plan }); });
router.post('/call/NeuromuscularBlock', (req, res) => { const r = Engine.NeuromuscularBlock(req.body || {}); res.json({ version: VER, module: 'pcc_critical_care_advanced', function: 'NeuromuscularBlock', plan: r.plan }); });
router.post('/call/DeliriumPrevention', (req, res) => { const r = Engine.DeliriumPrevention(req.body || {}); res.json({ version: VER, module: 'pcc_critical_care_advanced', function: 'DeliriumPrevention', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_critical_care_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
