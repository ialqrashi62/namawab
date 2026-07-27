// P3-EA pcc_wound_care_advanced_routes v3.91.0
// P3-EA: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_wound_care_advanced_engine.js');
const VER = '3.91.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_wound_care_advanced', label: 'PCC Wound Care Advanced', functions: Object.keys(Engine) });
});
router.post('/call/DiabeticFootUlcerStaging', (req, res) => { const r = Engine.DiabeticFootUlcerStaging(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'DiabeticFootUlcerStaging', plan: r.plan }); });
router.post('/call/PressureInjuryStaging', (req, res) => { const r = Engine.PressureInjuryStaging(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'PressureInjuryStaging', plan: r.plan }); });
router.post('/call/VenousLegUlcerCompression', (req, res) => { const r = Engine.VenousLegUlcerCompression(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'VenousLegUlcerCompression', plan: r.plan }); });
router.post('/call/ArterialWoundAssessment', (req, res) => { const r = Engine.ArterialWoundAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'ArterialWoundAssessment', plan: r.plan }); });
router.post('/call/WoundBiofilmManagement', (req, res) => { const r = Engine.WoundBiofilmManagement(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'WoundBiofilmManagement', plan: r.plan }); });
router.post('/call/NegativePressureWoundTherapy', (req, res) => { const r = Engine.NegativePressureWoundTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'NegativePressureWoundTherapy', plan: r.plan }); });
router.post('/call/HyperbaricOxygenIndication', (req, res) => { const r = Engine.HyperbaricOxygenIndication(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'HyperbaricOxygenIndication', plan: r.plan }); });
router.post('/call/SkinGraftSelection', (req, res) => { const r = Engine.SkinGraftSelection(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'SkinGraftSelection', plan: r.plan }); });
router.post('/call/FlapCoverageDecision', (req, res) => { const r = Engine.FlapCoverageDecision(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'FlapCoverageDecision', plan: r.plan }); });
router.post('/call/WoundCareNutritionProtocol', (req, res) => { const r = Engine.WoundCareNutritionProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'WoundCareNutritionProtocol', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_wound_care_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
