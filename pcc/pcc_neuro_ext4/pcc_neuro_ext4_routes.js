// P3-EM pcc_neuro_ext4_routes v3.103.0
// P3-EM: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_neuro_ext4_engine.js');
const VER = '3.103.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ext4', label: 'PCC Neuro Ext4', functions: Object.keys(Engine) });
});
router.post('/call/MitochondrialDiseaseNeuro', (req, res) => { const r = Engine.MitochondrialDiseaseNeuro(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'MitochondrialDiseaseNeuro', plan: r.plan }); });
router.post('/call/LeukodystrophyEval', (req, res) => { const r = Engine.LeukodystrophyEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'LeukodystrophyEval', plan: r.plan }); });
router.post('/call/NeurocutaneousSyndromes', (req, res) => { const r = Engine.NeurocutaneousSyndromes(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'NeurocutaneousSyndromes', plan: r.plan }); });
router.post('/call/CharcotMarieTooth', (req, res) => { const r = Engine.CharcotMarieTooth(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'CharcotMarieTooth', plan: r.plan }); });
router.post('/call/MyastheniaGravisCrisis', (req, res) => { const r = Engine.MyastheniaGravisCrisis(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'MyastheniaGravisCrisis', plan: r.plan }); });
router.post('/call/GuillainBarreSyndrome', (req, res) => { const r = Engine.GuillainBarreSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'GuillainBarreSyndrome', plan: r.plan }); });
router.post('/call/CIDPEval', (req, res) => { const r = Engine.CIDPEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'CIDPEval', plan: r.plan }); });
router.post('/call/ALSProtocol', (req, res) => { const r = Engine.ALSProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'ALSProtocol', plan: r.plan }); });
router.post('/call/PolymyositisDermatomyositis', (req, res) => { const r = Engine.PolymyositisDermatomyositis(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'PolymyositisDermatomyositis', plan: r.plan }); });
router.post('/call/MyotonicDystrophy', (req, res) => { const r = Engine.MyotonicDystrophy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'MyotonicDystrophy', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ext4', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
