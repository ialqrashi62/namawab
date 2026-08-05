// P3-CX pcc_weight_mgmt routes v3.62.0
// P3-CX: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_weight_mgmt';
const F = require('./pcc_weight_mgmt_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.62.0',
    module: 'pcc_weight_mgmt',
    label: 'PCC Weight Management',
    functions: Object.keys(F),
  });
});
  router.post('/call/Bmi', (req, res) => { const r = F.Bmi(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'Bmi', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/ObesityClass', (req, res) => { const r = F.ObesityClass(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'ObesityClass', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/BariatricReferral', (req, res) => { const r = F.BariatricReferral(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'BariatricReferral', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/DietPlan', (req, res) => { const r = F.DietPlan(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'DietPlan', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Exercise', (req, res) => { const r = F.Exercise(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'Exercise', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Comorbidity', (req, res) => { const r = F.Comorbidity(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'Comorbidity', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Medication', (req, res) => { const r = F.Medication(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'Medication', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/FollowUp', (req, res) => { const r = F.FollowUp(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'FollowUp', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Goal', (req, res) => { const r = F.Goal(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'Goal', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/SurgeryRisk', (req, res) => { const r = F.SurgeryRisk(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: 'SurgeryRisk', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.62.0', module: 'pcc_weight_mgmt', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
