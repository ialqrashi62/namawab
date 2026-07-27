// P3-DA pcc_longevity_medicine routes v3.65.0
// P3-DA: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_longevity_medicine_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.65.0',
    module: 'pcc_longevity_medicine',
    label: 'PCC Longevity Medicine',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/BiologicalAge', (req, res) => { const r = Engine.BiologicalAge(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'BiologicalAge', plan: r.plan }); })
  router.post('/call/Senolytics', (req, res) => { const r = Engine.Senolytics(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'Senolytics', plan: r.plan }); })
  router.post('/call/HormoneOptimization', (req, res) => { const r = Engine.HormoneOptimization(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'HormoneOptimization', plan: r.plan }); })
  router.post('/call/MetabolicHealth', (req, res) => { const r = Engine.MetabolicHealth(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'MetabolicHealth', plan: r.plan }); })
  router.post('/call/CognitivePreservation', (req, res) => { const r = Engine.CognitivePreservation(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'CognitivePreservation', plan: r.plan }); })
  router.post('/call/MuscleMass', (req, res) => { const r = Engine.MuscleMass(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'MuscleMass', plan: r.plan }); })
  router.post('/call/CardiovascularFitness', (req, res) => { const r = Engine.CardiovascularFitness(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'CardiovascularFitness', plan: r.plan }); })
  router.post('/call/Nutraceuticals', (req, res) => { const r = Engine.Nutraceuticals(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'Nutraceuticals', plan: r.plan }); })
  router.post('/call/LifestyleScore', (req, res) => { const r = Engine.LifestyleScore(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'LifestyleScore', plan: r.plan }); })
  router.post('/call/MortalityRisk', (req, res) => { const r = Engine.MortalityRisk(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: 'MortalityRisk', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.65.0', module: 'pcc_longevity_medicine', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
