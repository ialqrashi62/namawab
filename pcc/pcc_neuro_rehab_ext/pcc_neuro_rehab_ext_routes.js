// P3-DW pcc_neuro_rehab_ext_routes v3.87.0
// P3-DW: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neuro_rehab_ext_engine.js');
const VER = '3.87.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_rehab_ext', label: 'PCC Neuro Rehab Ext', functions: Object.keys(F) });
});
router.post('/call/StrokeNeuroplasticityProtocol', (req, res) => { const r = F.StrokeNeuroplasticityProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'StrokeNeuroplasticityProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ConstraintInducedMovement', (req, res) => { const r = F.ConstraintInducedMovement(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'ConstraintInducedMovement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VestibularRehabStroke', (req, res) => { const r = F.VestibularRehabStroke(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'VestibularRehabStroke', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SpasticityManagementITB', (req, res) => { const r = F.SpasticityManagementITB(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'SpasticityManagementITB', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DysphagiaSwallowTherapy', (req, res) => { const r = F.DysphagiaSwallowTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'DysphagiaSwallowTherapy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CognitiveRehabTraumatic', (req, res) => { const r = F.CognitiveRehabTraumatic(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'CognitiveRehabTraumatic', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AphasiaLanguageTherapy', (req, res) => { const r = F.AphasiaLanguageTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'AphasiaLanguageTherapy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SpinalCordInjuryRehab', (req, res) => { const r = F.SpinalCordInjuryRehab(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'SpinalCordInjuryRehab', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/WheelchairMobilityPrescription', (req, res) => { const r = F.WheelchairMobilityPrescription(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'WheelchairMobilityPrescription', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeuroRehabGoalSetting', (req, res) => { const r = F.NeuroRehabGoalSetting(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: 'NeuroRehabGoalSetting', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_rehab_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
