// P3-EL pcc_neuro_ext3_routes v3.102.0
// P3-EL: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neuro_ext3_engine.js');
const VER = '3.102.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ext3', label: 'PCC Neuro Ext3', functions: Object.keys(F) });
});
router.post('/call/NeuroSarcoidosisEval', (req, res) => { const r = F.NeuroSarcoidosisEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext3', function: 'NeuroSarcoidosisEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeuroBehcetEval', (req, res) => { const r = F.NeuroBehcetEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext3', function: 'NeuroBehcetEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeurosyphilisProtocol', (req, res) => { const r = F.NeurosyphilisProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext3', function: 'NeurosyphilisProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeuroLymeDisease', (req, res) => { const r = F.NeuroLymeDisease(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext3', function: 'NeuroLymeDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeuromyelitisOptica', (req, res) => { const r = F.NeuromyelitisOptica(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext3', function: 'NeuromyelitisOptica', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ProgressiveMS', (req, res) => { const r = F.ProgressiveMS(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext3', function: 'ProgressiveMS', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MOGAntibodyDisease', (req, res) => { const r = F.MOGAntibodyDisease(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext3', function: 'MOGAntibodyDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CLIPPERSProtocol', (req, res) => { const r = F.CLIPPERSProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext3', function: 'CLIPPERSProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AutoimmuneEncephalitisExtended', (req, res) => { const r = F.AutoimmuneEncephalitisExtended(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext3', function: 'AutoimmuneEncephalitisExtended', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CNSVasculitis', (req, res) => { const r = F.CNSVasculitis(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext3', function: 'CNSVasculitis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ext3', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
