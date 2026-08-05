// P3-DM pcc_antimicrobial_stewardship_routes v3.77.0
// P3-DM: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_antimicrobial_stewardship_engine.js');
const VER = '3.77.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', label: 'PCC Antimicrobial Stewardship', functions: Object.keys(F) });
});

router.post('/call/EmpiricAntibioticChoice', (req, res) => { const r = F.EmpiricAntibioticChoice(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'EmpiricAntibioticChoice', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DeEscalationReview', (req, res) => { const r = F.DeEscalationReview(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'DeEscalationReview', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TherapeuticDrugMonitoring', (req, res) => { const r = F.TherapeuticDrugMonitoring(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'TherapeuticDrugMonitoring', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AllergyCrossReactivity', (req, res) => { const r = F.AllergyCrossReactivity(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'AllergyCrossReactivity', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RenalDoseAdjustment', (req, res) => { const r = F.RenalDoseAdjustment(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'RenalDoseAdjustment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HepaticDoseAdjustment', (req, res) => { const r = F.HepaticDoseAdjustment(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'HepaticDoseAdjustment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DrugInteractionCheck', (req, res) => { const r = F.DrugInteractionCheck(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'DrugInteractionCheck', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CultureFollowUp', (req, res) => { const r = F.CultureFollowUp(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'CultureFollowUp', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AntibioticSpectrum', (req, res) => { const r = F.AntibioticSpectrum(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'AntibioticSpectrum', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/StewardshipMetrics', (req, res) => { const r = F.StewardshipMetrics(req.body || {}); res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: 'StewardshipMetrics', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_antimicrobial_stewardship', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
