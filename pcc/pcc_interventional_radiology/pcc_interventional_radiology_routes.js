// P3-EA pcc_interventional_radiology_routes v3.91.0
// P3-EA: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_interventional_radiology_engine.js');
const VER = '3.91.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_interventional_radiology', label: 'PCC Interventional Radiology', functions: Object.keys(F) });
});
router.post('/call/TIPSProcedure', (req, res) => { const r = F.TIPSProcedure(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'TIPSProcedure', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ChemoembolizationHCC', (req, res) => { const r = F.ChemoembolizationHCC(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'ChemoembolizationHCC', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/UterineFibroidEmbolization', (req, res) => { const r = F.UterineFibroidEmbolization(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'UterineFibroidEmbolization', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VertebroplastyKyphoplasty', (req, res) => { const r = F.VertebroplastyKyphoplasty(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'VertebroplastyKyphoplasty', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BiliaryDrainagePTBD', (req, res) => { const r = F.BiliaryDrainagePTBD(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'BiliaryDrainagePTBD', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GastrostomyTubePlacement', (req, res) => { const r = F.GastrostomyTubePlacement(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'GastrostomyTubePlacement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ThrombolysisDVT', (req, res) => { const r = F.ThrombolysisDVT(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'ThrombolysisDVT', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AorticStentGraft', (req, res) => { const r = F.AorticStentGraft(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'AorticStentGraft', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CryoablationTumor', (req, res) => { const r = F.CryoablationTumor(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'CryoablationTumor', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RadiofrequencyAblationLiver', (req, res) => { const r = F.RadiofrequencyAblationLiver(req.body || {}); res.json({ version: VER, module: 'pcc_interventional_radiology', function: 'RadiofrequencyAblationLiver', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_interventional_radiology', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
