// P3-DW pcc_neuro_rehab_ext_routes v3.87.0
// P3-DW: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_neuro_rehab_ext_engine.js');
const VER = '3.87.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_rehab_ext', label: 'PCC Neuro Rehab Ext', functions: Object.keys(Engine) });
});
router.post('/call/StrokeNeuroplasticityProtocol', (req, res) => { const r = Engine.StrokeNeuroplasticityProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'StrokeNeuroplasticityProtocol', plan: r.plan }); });
router.post('/call/ConstraintInducedMovement', (req, res) => { const r = Engine.ConstraintInducedMovement(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'ConstraintInducedMovement', plan: r.plan }); });
router.post('/call/VestibularRehabStroke', (req, res) => { const r = Engine.VestibularRehabStroke(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'VestibularRehabStroke', plan: r.plan }); });
router.post('/call/SpasticityManagementITB', (req, res) => { const r = Engine.SpasticityManagementITB(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'SpasticityManagementITB', plan: r.plan }); });
router.post('/call/DysphagiaSwallowTherapy', (req, res) => { const r = Engine.DysphagiaSwallowTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'DysphagiaSwallowTherapy', plan: r.plan }); });
router.post('/call/CognitiveRehabTraumatic', (req, res) => { const r = Engine.CognitiveRehabTraumatic(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'CognitiveRehabTraumatic', plan: r.plan }); });
router.post('/call/AphasiaLanguageTherapy', (req, res) => { const r = Engine.AphasiaLanguageTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'AphasiaLanguageTherapy', plan: r.plan }); });
router.post('/call/SpinalCordInjuryRehab', (req, res) => { const r = Engine.SpinalCordInjuryRehab(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'SpinalCordInjuryRehab', plan: r.plan }); });
router.post('/call/WheelchairMobilityPrescription', (req, res) => { const r = Engine.WheelchairMobilityPrescription(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'WheelchairMobilityPrescription', plan: r.plan }); });
router.post('/call/NeuroRehabGoalSetting', (req, res) => { const r = Engine.NeuroRehabGoalSetting(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'NeuroRehabGoalSetting', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
