// P3-EA pcc_interventional_radiology_routes v3.91.0
// P3-EA: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_interventional_radiology_engine.js');
const VER = '3.91.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_interventional_radiology', label: 'PCC Interventional Radiology', functions: Object.keys(Engine) });
});
router.post('/call/TIPSProcedure', (req, res) => { const r = Engine.TIPSProcedure(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'TIPSProcedure', plan: r.plan }); });
router.post('/call/ChemoembolizationHCC', (req, res) => { const r = Engine.ChemoembolizationHCC(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'ChemoembolizationHCC', plan: r.plan }); });
router.post('/call/UterineFibroidEmbolization', (req, res) => { const r = Engine.UterineFibroidEmbolization(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'UterineFibroidEmbolization', plan: r.plan }); });
router.post('/call/VertebroplastyKyphoplasty', (req, res) => { const r = Engine.VertebroplastyKyphoplasty(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'VertebroplastyKyphoplasty', plan: r.plan }); });
router.post('/call/BiliaryDrainagePTBD', (req, res) => { const r = Engine.BiliaryDrainagePTBD(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'BiliaryDrainagePTBD', plan: r.plan }); });
router.post('/call/GastrostomyTubePlacement', (req, res) => { const r = Engine.GastrostomyTubePlacement(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'GastrostomyTubePlacement', plan: r.plan }); });
router.post('/call/ThrombolysisDVT', (req, res) => { const r = Engine.ThrombolysisDVT(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'ThrombolysisDVT', plan: r.plan }); });
router.post('/call/AorticStentGraft', (req, res) => { const r = Engine.AorticStentGraft(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'AorticStentGraft', plan: r.plan }); });
router.post('/call/CryoablationTumor', (req, res) => { const r = Engine.CryoablationTumor(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'CryoablationTumor', plan: r.plan }); });
router.post('/call/RadiofrequencyAblationLiver', (req, res) => { const r = Engine.RadiofrequencyAblationLiver(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'RadiofrequencyAblationLiver', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_interventional_radiology', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
