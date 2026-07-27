// P3-EU pcc_neuro_ext12_routes v3.111.0
// P3-EU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_neuro_ext12_engine.js');
const VER = '3.111.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ext12', label: 'PCC Neuro Ext12', functions: Object.keys(Engine) });
});
router.post('/call/NeuroAIDSEval', (req, res) => { const r = Engine.NeuroAIDSEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'NeuroAIDSEval', plan: r.plan }); });
router.post('/call/PMLDiagnosis', (req, res) => { const r = Engine.PMLDiagnosis(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'PMLDiagnosis', plan: r.plan }); });
router.post('/call/JCVEval', (req, res) => { const r = Engine.JCVEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'JCVEval', plan: r.plan }); });
router.post('/call/ToxoplasmosisCerebral', (req, res) => { const r = Engine.ToxoplasmosisCerebral(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'ToxoplasmosisCerebral', plan: r.plan }); });
router.post('/call/CryptococcalMeningitis', (req, res) => { const r = Engine.CryptococcalMeningitis(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'CryptococcalMeningitis', plan: r.plan }); });
router.post('/call/TBMeningitisEval', (req, res) => { const r = Engine.TBMeningitisEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'TBMeningitisEval', plan: r.plan }); });
router.post('/call/LymeNeuroborreliosis', (req, res) => { const r = Engine.LymeNeuroborreliosis(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'LymeNeuroborreliosis', plan: r.plan }); });
router.post('/call/BrucellosisNeuro', (req, res) => { const r = Engine.BrucellosisNeuro(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'BrucellosisNeuro', plan: r.plan }); });
router.post('/call/WhippleDiseaseNeuro', (req, res) => { const r = Engine.WhippleDiseaseNeuro(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'WhippleDiseaseNeuro', plan: r.plan }); });
router.post('/call/BehcetNeuroSyndrome', (req, res) => { const r = Engine.BehcetNeuroSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext12', function: 'BehcetNeuroSyndrome', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ext12', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
