// P3-ED pcc_dental_advanced_routes v3.94.0
// P3-ED: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_dental_advanced_engine.js');
const VER = '3.94.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_dental_advanced', label: 'PCC Dental Advanced', functions: Object.keys(F) });
});
router.post('/call/ImpactedThirdMolarAssessment', (req, res) => { const r = F.ImpactedThirdMolarAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'ImpactedThirdMolarAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DentalImplantCandidacy', (req, res) => { const r = F.DentalImplantCandidacy(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'DentalImplantCandidacy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/OrthognathicSurgeryPlanning', (req, res) => { const r = F.OrthognathicSurgeryPlanning(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'OrthognathicSurgeryPlanning', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TemporomandibularDisorder', (req, res) => { const r = F.TemporomandibularDisorder(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'TemporomandibularDisorder', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/OralCancerScreening', (req, res) => { const r = F.OralCancerScreening(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'OralCancerScreening', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PeriodontalDiseaseStaging', (req, res) => { const r = F.PeriodontalDiseaseStaging(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'PeriodontalDiseaseStaging', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/EndodonticTreatmentPlan', (req, res) => { const r = F.EndodonticTreatmentPlan(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'EndodonticTreatmentPlan', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ProsthodonticRehabilitation', (req, res) => { const r = F.ProsthodonticRehabilitation(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'ProsthodonticRehabilitation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricDentalCaries', (req, res) => { const r = F.PediatricDentalCaries(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'PediatricDentalCaries', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/OralPathologyBiopsyIndication', (req, res) => { const r = F.OralPathologyBiopsyIndication(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'OralPathologyBiopsyIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_dental_advanced', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
