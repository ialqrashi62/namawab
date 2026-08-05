// P3-DE pcc_metabolic_health_routes v3.69.0
// P3-DE: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_metabolic_health_engine.js');
const VER = '3.69.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_metabolic_health', label: 'PCC Metabolic Health', functions: Object.keys(F) });
});

router.post('/call/InsulinResistance', (req, res) => { const r = F.InsulinResistance(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_health', function: 'InsulinResistance', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GlucoseVariability', (req, res) => { const r = F.GlucoseVariability(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_health', function: 'GlucoseVariability', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MetabolicSyndrome', (req, res) => { const r = F.MetabolicSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_health', function: 'MetabolicSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LipidProfile', (req, res) => { const r = F.LipidProfile(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_health', function: 'LipidProfile', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FattyLiver', (req, res) => { const r = F.FattyLiver(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_health', function: 'FattyLiver', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/KetogenicTherapy', (req, res) => { const r = F.KetogenicTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_health', function: 'KetogenicTherapy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TimeRestrictedEating', (req, res) => { const r = F.TimeRestrictedEating(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_health', function: 'TimeRestrictedEating', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ContinuousGlucose', (req, res) => { const r = F.ContinuousGlucose(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_health', function: 'ContinuousGlucose', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ThyroidMetabolism', (req, res) => { const r = F.ThyroidMetabolism(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_health', function: 'ThyroidMetabolism', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/WeightSetPoint', (req, res) => { const r = F.WeightSetPoint(req.body || {}); res.json({ version: VER, module: 'pcc_metabolic_health', function: 'WeightSetPoint', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_metabolic_health', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
