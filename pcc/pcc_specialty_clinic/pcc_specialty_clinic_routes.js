// P3-CT pcc_specialty_clinic routes v3.58.0
// P3-CT: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_specialty_clinic_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.58.0',
    module: 'pcc_specialty_clinic',
    label: 'PCC Specialty Clinic',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Referral', (req, res) => { const r = Engine.Referral(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'Referral', plan: r.plan }); })
  router.post('/call/Consult', (req, res) => { const r = Engine.Consult(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'Consult', plan: r.plan }); })
  router.post('/call/SecondOpinion', (req, res) => { const r = Engine.SecondOpinion(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'SecondOpinion', plan: r.plan }); })
  router.post('/call/FollowUp', (req, res) => { const r = Engine.FollowUp(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'FollowUp', plan: r.plan }); })
  router.post('/call/Procedure', (req, res) => { const r = Engine.Procedure(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'Procedure', plan: r.plan }); })
  router.post('/call/Triage', (req, res) => { const r = Engine.Triage(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'Triage', plan: r.plan }); })
  router.post('/call/NextStep', (req, res) => { const r = Engine.NextStep(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'NextStep', plan: r.plan }); })
  router.post('/call/Interval', (req, res) => { const r = Engine.Interval(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'Interval', plan: r.plan }); })
  router.post('/call/Coord', (req, res) => { const r = Engine.Coord(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'Coord', plan: r.plan }); })
  router.post('/call/Transition', (req, res) => { const r = Engine.Transition(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'Transition', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
