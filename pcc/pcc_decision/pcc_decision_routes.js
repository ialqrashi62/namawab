// P3-CC pcc_decision routes v3.41.0
// P3-CC: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_decision_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.41.0',
    module: 'pcc_decision',
    label: 'PCC Decision',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Triage', (req, res) => { const r = Engine.Triage(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'Triage', plan: r.plan }); })
  router.post('/call/Risk', (req, res) => { const r = Engine.Risk(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'Risk', plan: r.plan }); })
  router.post('/call/Recommendation', (req, res) => { const r = Engine.Recommendation(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'Recommendation', plan: r.plan }); })
  router.post('/call/Differential', (req, res) => { const r = Engine.Differential(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'Differential', plan: r.plan }); })
  router.post('/call/Path', (req, res) => { const r = Engine.Path(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'Path', plan: r.plan }); })
  router.post('/call/Severity', (req, res) => { const r = Engine.Severity(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'Severity', plan: r.plan }); })
  router.post('/call/Outcome', (req, res) => { const r = Engine.Outcome(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'Outcome', plan: r.plan }); })
  router.post('/call/FollowUp', (req, res) => { const r = Engine.FollowUp(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'FollowUp', plan: r.plan }); })
  router.post('/call/Test', (req, res) => { const r = Engine.Test(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'Test', plan: r.plan }); })
  router.post('/call/Therapy', (req, res) => { const r = Engine.Therapy(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'Therapy', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.41.0', module: 'pcc_decision', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
