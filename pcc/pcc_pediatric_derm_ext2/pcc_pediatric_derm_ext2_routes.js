// P3-EU pcc_pediatric_derm_ext2_routes v3.111.0
// P3-EU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_derm_ext2_engine.js');
const VER = '3.111.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', label: 'PCC Pediatric Derm Ext2', functions: Object.keys(F) });
});
router.post('/call/PediatricGenodermatoses', (req, res) => { const r = F.PediatricGenodermatoses(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricGenodermatoses', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricIchthyosis', (req, res) => { const r = F.PediatricIchthyosis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricIchthyosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricEB', (req, res) => { const r = F.PediatricEB(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricEB', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCutisLaxa', (req, res) => { const r = F.PediatricCutisLaxa(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricCutisLaxa', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricEhlersDanlos', (req, res) => { const r = F.PediatricEhlersDanlos(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricEhlersDanlos', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricMarfan', (req, res) => { const r = F.PediatricMarfan(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricMarfan', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricNeurofibromatosisSkin', (req, res) => { const r = F.PediatricNeurofibromatosisSkin(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricNeurofibromatosisSkin', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricTSCSutscutaneous', (req, res) => { const r = F.PediatricTSCSutscutaneous(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricTSCSutscutaneous', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricXP', (req, res) => { const r = F.PediatricXP(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricXP', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPorphyrias', (req, res) => { const r = F.PediatricPorphyrias(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricPorphyrias', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
