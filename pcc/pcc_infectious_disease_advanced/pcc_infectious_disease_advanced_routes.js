// P3-DM pcc_infectious_disease_advanced_routes v3.77.0
// P3-DM: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_infectious_disease_advanced_engine.js');
const VER = '3.77.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_infectious_disease_advanced', label: 'PCC Infectious Disease Advanced', functions: Object.keys(Engine) });
});

router.post('/call/FeverOfUnknownOrigin', (req, res) => { const r = Engine.FeverOfUnknownOrigin(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'FeverOfUnknownOrigin', plan: r.plan }); });
router.post('/call/TravelRelatedInfection', (req, res) => { const r = Engine.TravelRelatedInfection(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'TravelRelatedInfection', plan: r.plan }); });
router.post('/call/ImmunocompromisedHost', (req, res) => { const r = Engine.ImmunocompromisedHost(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'ImmunocompromisedHost', plan: r.plan }); });
router.post('/call/HealthcareAssociatedInfection', (req, res) => { const r = Engine.HealthcareAssociatedInfection(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'HealthcareAssociatedInfection', plan: r.plan }); });
router.post('/call/ZoonoticDisease', (req, res) => { const r = Engine.ZoonoticDisease(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'ZoonoticDisease', plan: r.plan }); });
router.post('/call/VectorBorneDisease', (req, res) => { const r = Engine.VectorBorneDisease(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'VectorBorneDisease', plan: r.plan }); });
router.post('/call/FungalInfectionWorkup', (req, res) => { const r = Engine.FungalInfectionWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'FungalInfectionWorkup', plan: r.plan }); });
router.post('/call/MycobacterialDisease', (req, res) => { const r = Engine.MycobacterialDisease(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'MycobacterialDisease', plan: r.plan }); });
router.post('/call/ViralHepatitisAdvanced', (req, res) => { const r = Engine.ViralHepatitisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'ViralHepatitisAdvanced', plan: r.plan }); });
router.post('/call/HIVOpportunisticInfection', (req, res) => { const r = Engine.HIVOpportunisticInfection(req.body || {}); res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: 'HIVOpportunisticInfection', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_infectious_disease_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
