// P3-EC pcc_hand_surgery_routes v3.93.0
// P3-EC: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_hand_surgery_engine.js');
const VER = '3.93.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_hand_surgery', label: 'PCC Hand Surgery', functions: Object.keys(Engine) });
});
router.post('/call/CarpalTunnelRelease', (req, res) => { const r = Engine.CarpalTunnelRelease(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'CarpalTunnelRelease', plan: r.plan }); });
router.post('/call/TriggerFingerRelease', (req, res) => { const r = Engine.TriggerFingerRelease(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'TriggerFingerRelease', plan: r.plan }); });
router.post('/call/DupuytrenContracture', (req, res) => { const r = Engine.DupuytrenContracture(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'DupuytrenContracture', plan: r.plan }); });
router.post('/call/DeQuervainRelease', (req, res) => { const r = Engine.DeQuervainRelease(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'DeQuervainRelease', plan: r.plan }); });
router.post('/call/TendonRepairZone', (req, res) => { const r = Engine.TendonRepairZone(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'TendonRepairZone', plan: r.plan }); });
router.post('/call/NerveRepairIndications', (req, res) => { const r = Engine.NerveRepairIndications(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'NerveRepairIndications', plan: r.plan }); });
router.post('/call/FractureReductionHand', (req, res) => { const r = Engine.FractureReductionHand(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'FractureReductionHand', plan: r.plan }); });
router.post('/call/ReplantationDecision', (req, res) => { const r = Engine.ReplantationDecision(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'ReplantationDecision', plan: r.plan }); });
router.post('/call/CongenitalHandDifference', (req, res) => { const r = Engine.CongenitalHandDifference(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'CongenitalHandDifference', plan: r.plan }); });
router.post('/call/WristArthroscopyIndication', (req, res) => { const r = Engine.WristArthroscopyIndication(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'WristArthroscopyIndication', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_hand_surgery', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
