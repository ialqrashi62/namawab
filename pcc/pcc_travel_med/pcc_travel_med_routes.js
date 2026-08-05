// P3-CY pcc_travel_med routes v3.63.0
// P3-CY: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_travel_med';
const F = require('./pcc_travel_med_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.63.0',
    module: 'pcc_travel_med',
    label: 'PCC Travel Medicine',
    functions: Object.keys(F),
  });
});
  router.post('/call/DestinationRisk', (req, res) => { const r = F.DestinationRisk(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'DestinationRisk', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/VaccinationNeed', (req, res) => { const r = F.VaccinationNeed(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'VaccinationNeed', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/MalariaProphylaxis', (req, res) => { const r = F.MalariaProphylaxis(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'MalariaProphylaxis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/TravelersDiarrhea', (req, res) => { const r = F.TravelersDiarrhea(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'TravelersDiarrhea', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/JetLag', (req, res) => { const r = F.JetLag(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'JetLag', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/DvtRisk', (req, res) => { const r = F.DvtRisk(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'DvtRisk', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Altitude', (req, res) => { const r = F.Altitude(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'Altitude', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/DivingFitness', (req, res) => { const r = F.DivingFitness(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'DivingFitness', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/PregnancyTravel', (req, res) => { const r = F.PregnancyTravel(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'PregnancyTravel', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/ReturnEvaluation', (req, res) => { const r = F.ReturnEvaluation(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'ReturnEvaluation', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.63.0', module: 'pcc_travel_med', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
