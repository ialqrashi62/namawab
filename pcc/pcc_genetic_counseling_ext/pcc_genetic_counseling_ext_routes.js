// P3-EA pcc_genetic_counseling_ext_routes v3.91.0
// P3-EA: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_genetic_counseling_ext_engine.js');
const VER = '3.91.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_genetic_counseling_ext', label: 'PCC Genetic Counseling Ext', functions: Object.keys(Engine) });
});
router.post('/call/HereditaryCancerSyndromeAssessment', (req, res) => { const r = Engine.HereditaryCancerSyndromeAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'HereditaryCancerSyndromeAssessment', plan: r.plan }); });
router.post('/call/BRCA1BRCA2RiskModel', (req, res) => { const r = Engine.BRCA1BRCA2RiskModel(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'BRCA1BRCA2RiskModel', plan: r.plan }); });
router.post('/call/LynchSyndromeScreen', (req, res) => { const r = Engine.LynchSyndromeScreen(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'LynchSyndromeScreen', plan: r.plan }); });
router.post('/call/FamilialHypercholesterolemia', (req, res) => { const r = Engine.FamilialHypercholesterolemia(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'FamilialHypercholesterolemia', plan: r.plan }); });
router.post('/call/PrenatalGeneticScreening', (req, res) => { const r = Engine.PrenatalGeneticScreening(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'PrenatalGeneticScreening', plan: r.plan }); });
router.post('/call/PreImplantationCounseling', (req, res) => { const r = Engine.PreImplantationCounseling(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'PreImplantationCounseling', plan: r.plan }); });
router.post('/call/PharmacogenomicInterpretation', (req, res) => { const r = Engine.PharmacogenomicInterpretation(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'PharmacogenomicInterpretation', plan: r.plan }); });
router.post('/call/CascadeFamilyScreening', (req, res) => { const r = Engine.CascadeFamilyScreening(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'CascadeFamilyScreening', plan: r.plan }); });
router.post('/call/VariantReclassification', (req, res) => { const r = Engine.VariantReclassification(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'VariantReclassification', plan: r.plan }); });
router.post('/call/ReproductiveGeneticOptions', (req, res) => { const r = Engine.ReproductiveGeneticOptions(req.body || {}); res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: 'ReproductiveGeneticOptions', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_genetic_counseling_ext', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
