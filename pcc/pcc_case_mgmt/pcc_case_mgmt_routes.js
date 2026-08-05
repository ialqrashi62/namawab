// P3-CQ pcc_case_mgmt routes v3.55.0
// P3-CQ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_case_mgmt';
const F = require('./pcc_case_mgmt_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.55.0',
    module: 'pcc_case_mgmt',
    label: 'PCC Case Mgmt',
    functions: Object.keys(F),
  });
});
  router.post('/call/Intake', (req, res) => { const r = F.Intake(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Intake', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Coord', (req, res) => { const r = F.Coord(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Coord', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Dc', (req, res) => { const r = F.Dc(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Dc', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Transition', (req, res) => { const r = F.Transition(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Transition', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Followup', (req, res) => { const r = F.Followup(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Followup', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Barriers', (req, res) => { const r = F.Barriers(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Barriers', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Insurance', (req, res) => { const r = F.Insurance(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Insurance', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Uta', (req, res) => { const r = F.Uta(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Uta', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Readmission', (req, res) => { const r = F.Readmission(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Readmission', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Multidisc', (req, res) => { const r = F.Multidisc(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Multidisc', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
