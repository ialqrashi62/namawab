// P3-CQ pcc_case_mgmt routes v3.55.0
// P3-CQ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_case_mgmt_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.55.0',
    module: 'pcc_case_mgmt',
    label: 'PCC Case Mgmt',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Intake', (req, res) => { const r = Engine.Intake(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Intake', plan: r.plan }); })
  router.post('/call/Coord', (req, res) => { const r = Engine.Coord(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Coord', plan: r.plan }); })
  router.post('/call/Dc', (req, res) => { const r = Engine.Dc(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Dc', plan: r.plan }); })
  router.post('/call/Transition', (req, res) => { const r = Engine.Transition(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Transition', plan: r.plan }); })
  router.post('/call/Followup', (req, res) => { const r = Engine.Followup(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Followup', plan: r.plan }); })
  router.post('/call/Barriers', (req, res) => { const r = Engine.Barriers(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Barriers', plan: r.plan }); })
  router.post('/call/Insurance', (req, res) => { const r = Engine.Insurance(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Insurance', plan: r.plan }); })
  router.post('/call/Uta', (req, res) => { const r = Engine.Uta(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Uta', plan: r.plan }); })
  router.post('/call/Readmission', (req, res) => { const r = Engine.Readmission(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Readmission', plan: r.plan }); })
  router.post('/call/Multidisc', (req, res) => { const r = Engine.Multidisc(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: 'Multidisc', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.55.0', module: 'pcc_case_mgmt', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
