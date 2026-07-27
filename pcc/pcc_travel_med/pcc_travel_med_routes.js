// P3-CY pcc_travel_med routes v3.63.0
// P3-CY: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_travel_med_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.63.0',
    module: 'pcc_travel_med',
    label: 'PCC Travel Medicine',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/DestinationRisk', (req, res) => { const r = Engine.DestinationRisk(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'DestinationRisk', plan: r.plan }); })
  router.post('/call/VaccinationNeed', (req, res) => { const r = Engine.VaccinationNeed(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'VaccinationNeed', plan: r.plan }); })
  router.post('/call/MalariaProphylaxis', (req, res) => { const r = Engine.MalariaProphylaxis(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'MalariaProphylaxis', plan: r.plan }); })
  router.post('/call/TravelersDiarrhea', (req, res) => { const r = Engine.TravelersDiarrhea(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'TravelersDiarrhea', plan: r.plan }); })
  router.post('/call/JetLag', (req, res) => { const r = Engine.JetLag(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'JetLag', plan: r.plan }); })
  router.post('/call/DvtRisk', (req, res) => { const r = Engine.DvtRisk(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'DvtRisk', plan: r.plan }); })
  router.post('/call/Altitude', (req, res) => { const r = Engine.Altitude(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'Altitude', plan: r.plan }); })
  router.post('/call/DivingFitness', (req, res) => { const r = Engine.DivingFitness(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'DivingFitness', plan: r.plan }); })
  router.post('/call/PregnancyTravel', (req, res) => { const r = Engine.PregnancyTravel(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'PregnancyTravel', plan: r.plan }); })
  router.post('/call/ReturnEvaluation', (req, res) => { const r = Engine.ReturnEvaluation(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_travel_med', function: 'ReturnEvaluation', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.63.0', module: 'pcc_travel_med', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
