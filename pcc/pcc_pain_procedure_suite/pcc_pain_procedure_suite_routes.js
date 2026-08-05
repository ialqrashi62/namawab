// P3-DU pcc_pain_procedure_suite_routes v3.85.0
// P3-DU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pain_procedure_suite_engine.js');
const VER = '3.85.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pain_procedure_suite', label: 'PCC Pain Procedure Suite', functions: Object.keys(F) });
});
router.post('/call/ProceduralSedation', (req, res) => { const r = F.ProceduralSedation(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'ProceduralSedation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/EpiduralBlock', (req, res) => { const r = F.EpiduralBlock(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'EpiduralBlock', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FacetJointInjection', (req, res) => { const r = F.FacetJointInjection(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'FacetJointInjection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RadiofrequencyAblation', (req, res) => { const r = F.RadiofrequencyAblation(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'RadiofrequencyAblation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SpinalCordStimulator', (req, res) => { const r = F.SpinalCordStimulator(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'SpinalCordStimulator', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/IntrathecalPump', (req, res) => { const r = F.IntrathecalPump(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'IntrathecalPump', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NerveBlockPeripheral', (req, res) => { const r = F.NerveBlockPeripheral(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'NerveBlockPeripheral', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TriggerPointInjection', (req, res) => { const r = F.TriggerPointInjection(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'TriggerPointInjection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/JointAspiration', (req, res) => { const r = F.JointAspiration(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'JointAspiration', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PainProcedureConsciousSedation', (req, res) => { const r = F.PainProcedureConsciousSedation(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'PainProcedureConsciousSedation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
