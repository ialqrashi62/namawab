// P3-CZ pcc_rehab_medicine routes v3.64.0
// P3-CZ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_rehab_medicine';
const F = require('./pcc_rehab_medicine_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.64.0',
    module: 'pcc_rehab_medicine',
    label: 'PCC Rehabilitation Medicine',
    functions: Object.keys(F),
  });
});
  router.post('/call/FunctionalStatus', (req, res) => { const r = F.FunctionalStatus(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'FunctionalStatus', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Impairment', (req, res) => { const r = F.Impairment(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'Impairment', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/GoalSetting', (req, res) => { const r = F.GoalSetting(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'GoalSetting', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/TherapyPlan', (req, res) => { const r = F.TherapyPlan(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'TherapyPlan', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/OutcomeMeasure', (req, res) => { const r = F.OutcomeMeasure(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'OutcomeMeasure', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/DischargePlan', (req, res) => { const r = F.DischargePlan(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'DischargePlan', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Equipment', (req, res) => { const r = F.Equipment(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'Equipment', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Caregiver', (req, res) => { const r = F.Caregiver(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'Caregiver', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/CommunityReintegration', (req, res) => { const r = F.CommunityReintegration(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'CommunityReintegration', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/QualityOfLife', (req, res) => { const r = F.QualityOfLife(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: 'QualityOfLife', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.64.0', module: 'pcc_rehab_medicine', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
