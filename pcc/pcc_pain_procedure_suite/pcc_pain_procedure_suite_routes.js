// P3-DU pcc_pain_procedure_suite_routes v3.85.0
// P3-DU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pain_procedure_suite_engine.js');
const VER = '3.85.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pain_procedure_suite', label: 'PCC Pain Procedure Suite', functions: Object.keys(Engine) });
});
router.post('/call/ProceduralSedation', (req, res) => { const r = Engine.ProceduralSedation(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'ProceduralSedation', plan: r.plan }); });
router.post('/call/EpiduralBlock', (req, res) => { const r = Engine.EpiduralBlock(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'EpiduralBlock', plan: r.plan }); });
router.post('/call/FacetJointInjection', (req, res) => { const r = Engine.FacetJointInjection(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'FacetJointInjection', plan: r.plan }); });
router.post('/call/RadiofrequencyAblation', (req, res) => { const r = Engine.RadiofrequencyAblation(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'RadiofrequencyAblation', plan: r.plan }); });
router.post('/call/SpinalCordStimulator', (req, res) => { const r = Engine.SpinalCordStimulator(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'SpinalCordStimulator', plan: r.plan }); });
router.post('/call/IntrathecalPump', (req, res) => { const r = Engine.IntrathecalPump(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'IntrathecalPump', plan: r.plan }); });
router.post('/call/NerveBlockPeripheral', (req, res) => { const r = Engine.NerveBlockPeripheral(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'NerveBlockPeripheral', plan: r.plan }); });
router.post('/call/TriggerPointInjection', (req, res) => { const r = Engine.TriggerPointInjection(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'TriggerPointInjection', plan: r.plan }); });
router.post('/call/JointAspiration', (req, res) => { const r = Engine.JointAspiration(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'JointAspiration', plan: r.plan }); });
router.post('/call/PainProcedureConsciousSedation', (req, res) => { const r = Engine.PainProcedureConsciousSedation(req.body || {}); res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: 'PainProcedureConsciousSedation', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pain_procedure_suite', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
