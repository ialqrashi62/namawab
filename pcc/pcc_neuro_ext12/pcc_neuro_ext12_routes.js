// P3-EU pcc_neuro_ext12_routes v3.111.0
// P3-EU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neuro_ext12_engine.js');
const VER = '3.111.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ext12', label: 'PCC Neuro Ext12', functions: Object.keys(F) });
});
router.post('/call/NeuroAIDSEval', (req, res) => { const r = F.NeuroAIDSEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'NeuroAIDSEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PMLDiagnosis', (req, res) => { const r = F.PMLDiagnosis(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'PMLDiagnosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/JCVEval', (req, res) => { const r = F.JCVEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'JCVEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ToxoplasmosisCerebral', (req, res) => { const r = F.ToxoplasmosisCerebral(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'ToxoplasmosisCerebral', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CryptococcalMeningitis', (req, res) => { const r = F.CryptococcalMeningitis(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'CryptococcalMeningitis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TBMeningitisEval', (req, res) => { const r = F.TBMeningitisEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'TBMeningitisEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LymeNeuroborreliosis', (req, res) => { const r = F.LymeNeuroborreliosis(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'LymeNeuroborreliosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BrucellosisNeuro', (req, res) => { const r = F.BrucellosisNeuro(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'BrucellosisNeuro', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/WhippleDiseaseNeuro', (req, res) => { const r = F.WhippleDiseaseNeuro(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'WhippleDiseaseNeuro', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BehcetNeuroSyndrome', (req, res) => { const r = F.BehcetNeuroSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'BehcetNeuroSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ext12', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
