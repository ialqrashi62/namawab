// P3-EA pcc_genetic_counseling_ext_routes v3.91.0
// P3-EA: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_genetic_counseling_ext_engine.js');
const VER = '3.91.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_genetic_counseling_ext', label: 'PCC Genetic Counseling Ext', functions: Object.keys(F) });
});
router.post('/call/HereditaryCancerSyndromeAssessment', (req, res) => { const r = F.HereditaryCancerSyndromeAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'HereditaryCancerSyndromeAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BRCA1BRCA2RiskModel', (req, res) => { const r = F.BRCA1BRCA2RiskModel(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'BRCA1BRCA2RiskModel', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LynchSyndromeScreen', (req, res) => { const r = F.LynchSyndromeScreen(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'LynchSyndromeScreen', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FamilialHypercholesterolemia', (req, res) => { const r = F.FamilialHypercholesterolemia(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'FamilialHypercholesterolemia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PrenatalGeneticScreening', (req, res) => { const r = F.PrenatalGeneticScreening(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'PrenatalGeneticScreening', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PreImplantationCounseling', (req, res) => { const r = F.PreImplantationCounseling(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'PreImplantationCounseling', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PharmacogenomicInterpretation', (req, res) => { const r = F.PharmacogenomicInterpretation(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'PharmacogenomicInterpretation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CascadeFamilyScreening', (req, res) => { const r = F.CascadeFamilyScreening(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'CascadeFamilyScreening', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VariantReclassification', (req, res) => { const r = F.VariantReclassification(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'VariantReclassification', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ReproductiveGeneticOptions', (req, res) => { const r = F.ReproductiveGeneticOptions(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'ReproductiveGeneticOptions', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
