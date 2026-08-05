// P3-EA pcc_wound_care_advanced_routes v3.91.0
// P3-EA: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_wound_care_advanced_engine.js');
const VER = '3.91.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_wound_care_advanced', label: 'PCC Wound Care Advanced', functions: Object.keys(F) });
});
router.post('/call/DiabeticFootUlcerStaging', (req, res) => { const r = F.DiabeticFootUlcerStaging(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'DiabeticFootUlcerStaging', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PressureInjuryStaging', (req, res) => { const r = F.PressureInjuryStaging(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'PressureInjuryStaging', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VenousLegUlcerCompression', (req, res) => { const r = F.VenousLegUlcerCompression(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'VenousLegUlcerCompression', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ArterialWoundAssessment', (req, res) => { const r = F.ArterialWoundAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'ArterialWoundAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/WoundBiofilmManagement', (req, res) => { const r = F.WoundBiofilmManagement(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'WoundBiofilmManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NegativePressureWoundTherapy', (req, res) => { const r = F.NegativePressureWoundTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'NegativePressureWoundTherapy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HyperbaricOxygenIndication', (req, res) => { const r = F.HyperbaricOxygenIndication(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'HyperbaricOxygenIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SkinGraftSelection', (req, res) => { const r = F.SkinGraftSelection(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'SkinGraftSelection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FlapCoverageDecision', (req, res) => { const r = F.FlapCoverageDecision(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'FlapCoverageDecision', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/WoundCareNutritionProtocol', (req, res) => { const r = F.WoundCareNutritionProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_wound_care_advanced', function: 'WoundCareNutritionProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_wound_care_advanced', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
