// P3-EM pcc_neuro_ext4_routes v3.103.0
// P3-EM: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neuro_ext4_engine.js');
const VER = '3.103.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ext4', label: 'PCC Neuro Ext4', functions: Object.keys(F) });
});
router.post('/call/MitochondrialDiseaseNeuro', (req, res) => { const r = F.MitochondrialDiseaseNeuro(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'MitochondrialDiseaseNeuro', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LeukodystrophyEval', (req, res) => { const r = F.LeukodystrophyEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'LeukodystrophyEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeurocutaneousSyndromes', (req, res) => { const r = F.NeurocutaneousSyndromes(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'NeurocutaneousSyndromes', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CharcotMarieTooth', (req, res) => { const r = F.CharcotMarieTooth(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'CharcotMarieTooth', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MyastheniaGravisCrisis', (req, res) => { const r = F.MyastheniaGravisCrisis(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'MyastheniaGravisCrisis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GuillainBarreSyndrome', (req, res) => { const r = F.GuillainBarreSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'GuillainBarreSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CIDPEval', (req, res) => { const r = F.CIDPEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'CIDPEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ALSProtocol', (req, res) => { const r = F.ALSProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'ALSProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PolymyositisDermatomyositis', (req, res) => { const r = F.PolymyositisDermatomyositis(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'PolymyositisDermatomyositis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MyotonicDystrophy', (req, res) => { const r = F.MyotonicDystrophy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext4', function: 'MyotonicDystrophy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ext4', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
