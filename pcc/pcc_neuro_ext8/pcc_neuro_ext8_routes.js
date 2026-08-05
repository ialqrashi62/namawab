// P3-EQ pcc_neuro_ext8_routes v3.107.0
// P3-EQ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neuro_ext8_engine.js');
const VER = '3.107.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ext8', label: 'PCC Neuro Ext8', functions: Object.keys(F) });
});
router.post('/call/AcuteFlaccidMyelitis', (req, res) => { const r = F.AcuteFlaccidMyelitis(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext8', function: 'AcuteFlaccidMyelitis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TransverseMyelitisEval', (req, res) => { const r = F.TransverseMyelitisEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext8', function: 'TransverseMyelitisEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeuromyelitisOpticaExt', (req, res) => { const r = F.NeuromyelitisOpticaExt(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext8', function: 'NeuromyelitisOpticaExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/OpticNeuritisEval', (req, res) => { const r = F.OpticNeuritisEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext8', function: 'OpticNeuritisEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ConusMedullarisSyndrome', (req, res) => { const r = F.ConusMedullarisSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext8', function: 'ConusMedullarisSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CaudaEquinaEval', (req, res) => { const r = F.CaudaEquinaEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext8', function: 'CaudaEquinaEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SyringomyeliaEval', (req, res) => { const r = F.SyringomyeliaEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext8', function: 'SyringomyeliaEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TetheredCordSyndrome', (req, res) => { const r = F.TetheredCordSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext8', function: 'TetheredCordSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DiastematomyeliaEval', (req, res) => { const r = F.DiastematomyeliaEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext8', function: 'DiastematomyeliaEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SpinalDuralAVFistula', (req, res) => { const r = F.SpinalDuralAVFistula(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext8', function: 'SpinalDuralAVFistula', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ext8', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
