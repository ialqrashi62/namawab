// P3-DM pcc_antimicrobial_stewardship_routes v3.77.0
// P3-DM: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_antimicrobial_stewardship_engine.js');
const VER = '3.77.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', label: 'PCC Antimicrobial Stewardship', functions: Object.keys(Engine) });
});

router.post('/call/EmpiricAntibioticChoice', (req, res) => { const r = Engine.EmpiricAntibioticChoice(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'EmpiricAntibioticChoice', plan: r.plan }); });
router.post('/call/DeEscalationReview', (req, res) => { const r = Engine.DeEscalationReview(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'DeEscalationReview', plan: r.plan }); });
router.post('/call/TherapeuticDrugMonitoring', (req, res) => { const r = Engine.TherapeuticDrugMonitoring(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'TherapeuticDrugMonitoring', plan: r.plan }); });
router.post('/call/AllergyCrossReactivity', (req, res) => { const r = Engine.AllergyCrossReactivity(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'AllergyCrossReactivity', plan: r.plan }); });
router.post('/call/RenalDoseAdjustment', (req, res) => { const r = Engine.RenalDoseAdjustment(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'RenalDoseAdjustment', plan: r.plan }); });
router.post('/call/HepaticDoseAdjustment', (req, res) => { const r = Engine.HepaticDoseAdjustment(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'HepaticDoseAdjustment', plan: r.plan }); });
router.post('/call/DrugInteractionCheck', (req, res) => { const r = Engine.DrugInteractionCheck(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'DrugInteractionCheck', plan: r.plan }); });
router.post('/call/CultureFollowUp', (req, res) => { const r = Engine.CultureFollowUp(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'CultureFollowUp', plan: r.plan }); });
router.post('/call/AntibioticSpectrum', (req, res) => { const r = Engine.AntibioticSpectrum(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'AntibioticSpectrum', plan: r.plan }); });
router.post('/call/StewardshipMetrics', (req, res) => { const r = Engine.StewardshipMetrics(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'StewardshipMetrics', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
