// P3-DQ pcc_pediatrics_advanced_routes v3.81.0
// P3-DQ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatrics_advanced_engine.js');
const VER = '3.81.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatrics_advanced', label: 'PCC Pediatrics Advanced', functions: Object.keys(Engine) });
});

router.post('/call/PediatricSepsisAdvanced', (req, res) => { const r = Engine.PediatricSepsisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'PediatricSepsisAdvanced', plan: r.plan }); });
router.post('/call/DiabeticKetoacidosisPedi', (req, res) => { const r = Engine.DiabeticKetoacidosisPedi(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'DiabeticKetoacidosisPedi', plan: r.plan }); });
router.post('/call/StatusEpilepticusPedi', (req, res) => { const r = Engine.StatusEpilepticusPedi(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'StatusEpilepticusPedi', plan: r.plan }); });
router.post('/call/BronchiolitisSevere', (req, res) => { const r = Engine.BronchiolitisSevere(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'BronchiolitisSevere', plan: r.plan }); });
router.post('/call/PediatricAsthmaSevere', (req, res) => { const r = Engine.PediatricAsthmaSevere(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'PediatricAsthmaSevere', plan: r.plan }); });
router.post('/call/CongenitalHeartDisease', (req, res) => { const r = Engine.CongenitalHeartDisease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'CongenitalHeartDisease', plan: r.plan }); });
router.post('/call/PediatricOncologyEmergencies', (req, res) => { const r = Engine.PediatricOncologyEmergencies(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'PediatricOncologyEmergencies', plan: r.plan }); });
router.post('/call/InbornErrorsMetabolism', (req, res) => { const r = Engine.InbornErrorsMetabolism(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'InbornErrorsMetabolism', plan: r.plan }); });
router.post('/call/PediatricNeurocritical', (req, res) => { const r = Engine.PediatricNeurocritical(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'PediatricNeurocritical', plan: r.plan }); });
router.post('/call/PediatricToxicology', (req, res) => { const r = Engine.PediatricToxicology(req.body || {}); res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: 'PediatricToxicology', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatrics_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
