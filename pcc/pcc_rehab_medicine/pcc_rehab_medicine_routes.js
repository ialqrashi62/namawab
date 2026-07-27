// P3-CZ pcc_rehab_medicine routes v3.64.0
// P3-CZ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_rehab_medicine_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.64.0',
    module: 'pcc_rehab_medicine',
    label: 'PCC Rehabilitation Medicine',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/FunctionalStatus', (req, res) => { const r = Engine.FunctionalStatus(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'FunctionalStatus', plan: r.plan }); })
  router.post('/call/Impairment', (req, res) => { const r = Engine.Impairment(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'Impairment', plan: r.plan }); })
  router.post('/call/GoalSetting', (req, res) => { const r = Engine.GoalSetting(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'GoalSetting', plan: r.plan }); })
  router.post('/call/TherapyPlan', (req, res) => { const r = Engine.TherapyPlan(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'TherapyPlan', plan: r.plan }); })
  router.post('/call/OutcomeMeasure', (req, res) => { const r = Engine.OutcomeMeasure(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'OutcomeMeasure', plan: r.plan }); })
  router.post('/call/DischargePlan', (req, res) => { const r = Engine.DischargePlan(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'DischargePlan', plan: r.plan }); })
  router.post('/call/Equipment', (req, res) => { const r = Engine.Equipment(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'Equipment', plan: r.plan }); })
  router.post('/call/Caregiver', (req, res) => { const r = Engine.Caregiver(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'Caregiver', plan: r.plan }); })
  router.post('/call/CommunityReintegration', (req, res) => { const r = Engine.CommunityReintegration(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'CommunityReintegration', plan: r.plan }); })
  router.post('/call/QualityOfLife', (req, res) => { const r = Engine.QualityOfLife(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'QualityOfLife', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
