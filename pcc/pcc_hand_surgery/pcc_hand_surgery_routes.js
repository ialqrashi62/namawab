// P3-EC pcc_hand_surgery_routes v3.93.0
// P3-EC: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_hand_surgery_engine.js');
const VER = '3.93.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_hand_surgery', label: 'PCC Hand Surgery', functions: Object.keys(F) });
});
router.post('/call/CarpalTunnelRelease', (req, res) => { const r = F.CarpalTunnelRelease(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'CarpalTunnelRelease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TriggerFingerRelease', (req, res) => { const r = F.TriggerFingerRelease(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'TriggerFingerRelease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DupuytrenContracture', (req, res) => { const r = F.DupuytrenContracture(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'DupuytrenContracture', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DeQuervainRelease', (req, res) => { const r = F.DeQuervainRelease(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'DeQuervainRelease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TendonRepairZone', (req, res) => { const r = F.TendonRepairZone(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'TendonRepairZone', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NerveRepairIndications', (req, res) => { const r = F.NerveRepairIndications(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'NerveRepairIndications', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FractureReductionHand', (req, res) => { const r = F.FractureReductionHand(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'FractureReductionHand', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ReplantationDecision', (req, res) => { const r = F.ReplantationDecision(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'ReplantationDecision', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CongenitalHandDifference', (req, res) => { const r = F.CongenitalHandDifference(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'CongenitalHandDifference', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/WristArthroscopyIndication', (req, res) => { const r = F.WristArthroscopyIndication(req.body || {}); res.json({ version: VER, module: 'pcc_hand_surgery', function: 'WristArthroscopyIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_hand_surgery', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
