// P3-CX pcc_weight_mgmt routes v3.62.0
// P3-CX: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_weight_mgmt_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.62.0',
    module: 'pcc_weight_mgmt',
    label: 'PCC Weight Management',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Bmi', (req, res) => { const r = Engine.Bmi(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'Bmi', plan: r.plan }); })
  router.post('/call/ObesityClass', (req, res) => { const r = Engine.ObesityClass(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'ObesityClass', plan: r.plan }); })
  router.post('/call/BariatricReferral', (req, res) => { const r = Engine.BariatricReferral(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'BariatricReferral', plan: r.plan }); })
  router.post('/call/DietPlan', (req, res) => { const r = Engine.DietPlan(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'DietPlan', plan: r.plan }); })
  router.post('/call/Exercise', (req, res) => { const r = Engine.Exercise(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'Exercise', plan: r.plan }); })
  router.post('/call/Comorbidity', (req, res) => { const r = Engine.Comorbidity(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'Comorbidity', plan: r.plan }); })
  router.post('/call/Medication', (req, res) => { const r = Engine.Medication(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'Medication', plan: r.plan }); })
  router.post('/call/FollowUp', (req, res) => { const r = Engine.FollowUp(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'FollowUp', plan: r.plan }); })
  router.post('/call/Goal', (req, res) => { const r = Engine.Goal(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'Goal', plan: r.plan }); })
  router.post('/call/SurgeryRisk', (req, res) => { const r = Engine.SurgeryRisk(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'SurgeryRisk', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
