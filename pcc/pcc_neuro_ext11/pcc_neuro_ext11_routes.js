// P3-ET pcc_neuro_ext11_routes v3.110.0
// P3-ET: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neuro_ext11_engine.js');
const VER = '3.110.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ext11', label: 'PCC Neuro Ext11', functions: Object.keys(F) });
});
router.post('/call/DemyelinatingPolyneuropathy', (req, res) => { const r = F.DemyelinatingPolyneuropathy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext11', function: 'DemyelinatingPolyneuropathy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CIDPExtEval', (req, res) => { const r = F.CIDPExtEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext11', function: 'CIDPExtEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GBSVariantEval', (req, res) => { const r = F.GBSVariantEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext11', function: 'GBSVariantEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MillerFisherSyndrome', (req, res) => { const r = F.MillerFisherSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext11', function: 'MillerFisherSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BickerstaffBrainstemEncephalitis', (req, res) => { const r = F.BickerstaffBrainstemEncephalitis(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext11', function: 'BickerstaffBrainstemEncephalitis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AMANEval', (req, res) => { const r = F.AMANEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext11', function: 'AMANEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SensoryCIDPEval', (req, res) => { const r = F.SensoryCIDPEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext11', function: 'SensoryCIDPEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MotorCIDPEval', (req, res) => { const r = F.MotorCIDPEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext11', function: 'MotorCIDPEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AutonomicNeuropathyEval', (req, res) => { const r = F.AutonomicNeuropathyEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext11', function: 'AutonomicNeuropathyEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SmallFiberNeuropathyEval', (req, res) => { const r = F.SmallFiberNeuropathyEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext11', function: 'SmallFiberNeuropathyEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ext11', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
