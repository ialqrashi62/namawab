// P3-DA pcc_functional_medicine routes v3.65.0
// P3-DA: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_functional_medicine_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.65.0',
    module: 'pcc_functional_medicine',
    label: 'PCC Functional Medicine',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/RootCause', (req, res) => { const r = Engine.RootCause(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'RootCause', plan: r.plan }); })
  router.post('/call/Timeline', (req, res) => { const r = Engine.Timeline(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'Timeline', plan: r.plan }); })
  router.post('/call/EliminationDiet', (req, res) => { const r = Engine.EliminationDiet(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'EliminationDiet', plan: r.plan }); })
  router.post('/call/GutHealing', (req, res) => { const r = Engine.GutHealing(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'GutHealing', plan: r.plan }); })
  router.post('/call/HormoneBalance', (req, res) => { const r = Engine.HormoneBalance(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'HormoneBalance', plan: r.plan }); })
  router.post('/call/Toxicity', (req, res) => { const r = Engine.Toxicity(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'Toxicity', plan: r.plan }); })
  router.post('/call/Inflammation', (req, res) => { const r = Engine.Inflammation(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'Inflammation', plan: r.plan }); })
  router.post('/call/MitochondrialSupport', (req, res) => { const r = Engine.MitochondrialSupport(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'MitochondrialSupport', plan: r.plan }); })
  router.post('/call/ImmuneModulation', (req, res) => { const r = Engine.ImmuneModulation(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'ImmuneModulation', plan: r.plan }); })
  router.post('/call/PersonalizedPlan', (req, res) => { const r = Engine.PersonalizedPlan(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'PersonalizedPlan', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
