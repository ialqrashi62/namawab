// P3-DA pcc_longevity_medicine routes v3.65.0
// P3-DA: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_longevity_medicine';
const F = require('./pcc_longevity_medicine_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.65.0',
    module: 'pcc_longevity_medicine',
    label: 'PCC Longevity Medicine',
    functions: Object.keys(F),
  });
});
  router.post('/call/BiologicalAge', (req, res) => { const r = F.BiologicalAge(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'BiologicalAge', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Senolytics', (req, res) => { const r = F.Senolytics(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'Senolytics', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/HormoneOptimization', (req, res) => { const r = F.HormoneOptimization(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'HormoneOptimization', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/MetabolicHealth', (req, res) => { const r = F.MetabolicHealth(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'MetabolicHealth', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/CognitivePreservation', (req, res) => { const r = F.CognitivePreservation(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'CognitivePreservation', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/MuscleMass', (req, res) => { const r = F.MuscleMass(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'MuscleMass', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/CardiovascularFitness', (req, res) => { const r = F.CardiovascularFitness(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'CardiovascularFitness', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Nutraceuticals', (req, res) => { const r = F.Nutraceuticals(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'Nutraceuticals', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/LifestyleScore', (req, res) => { const r = F.LifestyleScore(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'LifestyleScore', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/MortalityRisk', (req, res) => { const r = F.MortalityRisk(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'MortalityRisk', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
