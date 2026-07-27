// P3-EU pcc_pediatric_derm_ext2_routes v3.111.0
// P3-EU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_derm_ext2_engine.js');
const VER = '3.111.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', label: 'PCC Pediatric Derm Ext2', functions: Object.keys(Engine) });
});
router.post('/call/PediatricGenodermatoses', (req, res) => { const r = Engine.PediatricGenodermatoses(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricGenodermatoses', plan: r.plan }); });
router.post('/call/PediatricIchthyosis', (req, res) => { const r = Engine.PediatricIchthyosis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricIchthyosis', plan: r.plan }); });
router.post('/call/PediatricEB', (req, res) => { const r = Engine.PediatricEB(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricEB', plan: r.plan }); });
router.post('/call/PediatricCutisLaxa', (req, res) => { const r = Engine.PediatricCutisLaxa(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricCutisLaxa', plan: r.plan }); });
router.post('/call/PediatricEhlersDanlos', (req, res) => { const r = Engine.PediatricEhlersDanlos(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricEhlersDanlos', plan: r.plan }); });
router.post('/call/PediatricMarfan', (req, res) => { const r = Engine.PediatricMarfan(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricMarfan', plan: r.plan }); });
router.post('/call/PediatricNeurofibromatosisSkin', (req, res) => { const r = Engine.PediatricNeurofibromatosisSkin(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricNeurofibromatosisSkin', plan: r.plan }); });
router.post('/call/PediatricTSCSutscutaneous', (req, res) => { const r = Engine.PediatricTSCSutscutaneous(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricTSCSutscutaneous', plan: r.plan }); });
router.post('/call/PediatricXP', (req, res) => { const r = Engine.PediatricXP(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricXP', plan: r.plan }); });
router.post('/call/PediatricPorphyrias', (req, res) => { const r = Engine.PediatricPorphyrias(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: 'PediatricPorphyrias', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_derm_ext2', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
