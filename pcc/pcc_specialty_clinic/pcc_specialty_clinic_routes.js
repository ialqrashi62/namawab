// P3-CT pcc_specialty_clinic routes v3.58.0
// P3-CT: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_specialty_clinic';
const F = require('./pcc_specialty_clinic_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.58.0',
    module: 'pcc_specialty_clinic',
    label: 'PCC Specialty Clinic',
    functions: Object.keys(F),
  });
});
  router.post('/call/Referral', (req, res) => { const r = F.Referral(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'Referral', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Consult', (req, res) => { const r = F.Consult(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'Consult', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/SecondOpinion', (req, res) => { const r = F.SecondOpinion(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'SecondOpinion', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/FollowUp', (req, res) => { const r = F.FollowUp(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'FollowUp', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Procedure', (req, res) => { const r = F.Procedure(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'Procedure', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Triage', (req, res) => { const r = F.Triage(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'Triage', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/NextStep', (req, res) => { const r = F.NextStep(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'NextStep', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Interval', (req, res) => { const r = F.Interval(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'Interval', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Coord', (req, res) => { const r = F.Coord(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'Coord', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Transition', (req, res) => { const r = F.Transition(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: 'Transition', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.58.0', module: 'pcc_specialty_clinic', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
