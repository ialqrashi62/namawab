// P3-ED pcc_dental_advanced_routes v3.94.0
// P3-ED: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_dental_advanced_engine.js');
const VER = '3.94.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_dental_advanced', label: 'PCC Dental Advanced', functions: Object.keys(Engine) });
});
router.post('/call/ImpactedThirdMolarAssessment', (req, res) => { const r = Engine.ImpactedThirdMolarAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'ImpactedThirdMolarAssessment', plan: r.plan }); });
router.post('/call/DentalImplantCandidacy', (req, res) => { const r = Engine.DentalImplantCandidacy(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'DentalImplantCandidacy', plan: r.plan }); });
router.post('/call/OrthognathicSurgeryPlanning', (req, res) => { const r = Engine.OrthognathicSurgeryPlanning(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'OrthognathicSurgeryPlanning', plan: r.plan }); });
router.post('/call/TemporomandibularDisorder', (req, res) => { const r = Engine.TemporomandibularDisorder(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'TemporomandibularDisorder', plan: r.plan }); });
router.post('/call/OralCancerScreening', (req, res) => { const r = Engine.OralCancerScreening(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'OralCancerScreening', plan: r.plan }); });
router.post('/call/PeriodontalDiseaseStaging', (req, res) => { const r = Engine.PeriodontalDiseaseStaging(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'PeriodontalDiseaseStaging', plan: r.plan }); });
router.post('/call/EndodonticTreatmentPlan', (req, res) => { const r = Engine.EndodonticTreatmentPlan(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'EndodonticTreatmentPlan', plan: r.plan }); });
router.post('/call/ProsthodonticRehabilitation', (req, res) => { const r = Engine.ProsthodonticRehabilitation(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'ProsthodonticRehabilitation', plan: r.plan }); });
router.post('/call/PediatricDentalCaries', (req, res) => { const r = Engine.PediatricDentalCaries(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'PediatricDentalCaries', plan: r.plan }); });
router.post('/call/OralPathologyBiopsyIndication', (req, res) => { const r = Engine.OralPathologyBiopsyIndication(req.body || {}); res.json({ version: VER, module: 'pcc_dental_advanced', function: 'OralPathologyBiopsyIndication', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_dental_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
