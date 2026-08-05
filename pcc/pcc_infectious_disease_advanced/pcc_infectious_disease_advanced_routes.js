// P3-DM pcc_infectious_disease_advanced_routes v3.77.0
// P3-DM: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_infectious_disease_advanced_engine.js');
const VER = '3.77.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_infectious_disease_advanced', label: 'PCC Infectious Disease Advanced', functions: Object.keys(F) });
});

router.post('/call/FeverOfUnknownOrigin', (req, res) => { const r = F.FeverOfUnknownOrigin(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'FeverOfUnknownOrigin', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TravelRelatedInfection', (req, res) => { const r = F.TravelRelatedInfection(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'TravelRelatedInfection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ImmunocompromisedHost', (req, res) => { const r = F.ImmunocompromisedHost(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'ImmunocompromisedHost', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HealthcareAssociatedInfection', (req, res) => { const r = F.HealthcareAssociatedInfection(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'HealthcareAssociatedInfection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ZoonoticDisease', (req, res) => { const r = F.ZoonoticDisease(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'ZoonoticDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VectorBorneDisease', (req, res) => { const r = F.VectorBorneDisease(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'VectorBorneDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FungalInfectionWorkup', (req, res) => { const r = F.FungalInfectionWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'FungalInfectionWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MycobacterialDisease', (req, res) => { const r = F.MycobacterialDisease(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'MycobacterialDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ViralHepatitisAdvanced', (req, res) => { const r = F.ViralHepatitisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'ViralHepatitisAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HIVOpportunisticInfection', (req, res) => { const r = F.HIVOpportunisticInfection(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'HIVOpportunisticInfection', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
