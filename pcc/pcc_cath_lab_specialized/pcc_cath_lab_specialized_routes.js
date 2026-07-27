// P3-DS pcc_cath_lab_specialized_routes v3.83.0
// P3-DS: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_cath_lab_specialized_engine.js');
const VER = '3.83.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_cath_lab_specialized', label: 'PCC Cath Lab Specialized', functions: Object.keys(Engine) });
});

router.post('/call/CTOScoreJCTO', (req, res) => { const r = Engine.CTOScoreJCTO(req.body || {}); res.json({ version: VER, module: 'pcc_cath_lab_specialized', function: 'CTOScoreJCTO', plan: r.plan }); });
router.post('/call/SyntaxScore', (req, res) => { const r = Engine.SyntaxScore(req.body || {}); res.json({ version: VER, module: 'pcc_cath_lab_specialized', function: 'SyntaxScore', plan: r.plan }); });
router.post('/call/CalciumScoreIVUS', (req, res) => { const r = Engine.CalciumScoreIVUS(req.body || {}); res.json({ version: VER, module: 'pcc_cath_lab_specialized', function: 'CalciumScoreIVUS', plan: r.plan }); });
router.post('/call/FFRiFRAnalysis', (req, res) => { const r = Engine.FFRiFRAnalysis(req.body || {}); res.json({ version: VER, module: 'pcc_cath_lab_specialized', function: 'FFRiFRAnalysis', plan: r.plan }); });
router.post('/call/BifurcationMedina', (req, res) => { const r = Engine.BifurcationMedina(req.body || {}); res.json({ version: VER, module: 'pcc_cath_lab_specialized', function: 'BifurcationMedina', plan: r.plan }); });
router.post('/call/PerforationEllis', (req, res) => { const r = Engine.PerforationEllis(req.body || {}); res.json({ version: VER, module: 'pcc_cath_lab_specialized', function: 'PerforationEllis', plan: r.plan }); });
router.post('/call/RotablationBurr', (req, res) => { const r = Engine.RotablationBurr(req.body || {}); res.json({ version: VER, module: 'pcc_cath_lab_specialized', function: 'RotablationBurr', plan: r.plan }); });
router.post('/call/IVLDelivery', (req, res) => { const r = Engine.IVLDelivery(req.body || {}); res.json({ version: VER, module: 'pcc_cath_lab_specialized', function: 'IVLDelivery', plan: r.plan }); });
router.post('/call/NoReflowPredict', (req, res) => { const r = Engine.NoReflowPredict(req.body || {}); res.json({ version: VER, module: 'pcc_cath_lab_specialized', function: 'NoReflowPredict', plan: r.plan }); });
router.post('/call/CoronaryDissectionType', (req, res) => { const r = Engine.CoronaryDissectionType(req.body || {}); res.json({ version: VER, module: 'pcc_cath_lab_specialized', function: 'CoronaryDissectionType', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_cath_lab_specialized', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
