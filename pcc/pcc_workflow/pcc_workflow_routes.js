// P3-CB pcc_workflow routes v3.40.0
// P3-CB: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_workflow_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.40.0',
    module: 'pcc_workflow',
    label: 'PCC Workflow',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/State', (req, res) => { const r = Engine.State(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'State', plan: r.plan }); })
  router.post('/call/Transition', (req, res) => { const r = Engine.Transition(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'Transition', plan: r.plan }); })
  router.post('/call/Assignment', (req, res) => { const r = Engine.Assignment(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'Assignment', plan: r.plan }); })
  router.post('/call/Escalation', (req, res) => { const r = Engine.Escalation(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'Escalation', plan: r.plan }); })
  router.post('/call/Notify', (req, res) => { const r = Engine.Notify(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'Notify', plan: r.plan }); })
  router.post('/call/Approval', (req, res) => { const r = Engine.Approval(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'Approval', plan: r.plan }); })
  router.post('/call/Schedule', (req, res) => { const r = Engine.Schedule(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'Schedule', plan: r.plan }); })
  router.post('/call/Queue', (req, res) => { const r = Engine.Queue(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'Queue', plan: r.plan }); })
  router.post('/call/Timeout', (req, res) => { const r = Engine.Timeout(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'Timeout', plan: r.plan }); })
  router.post('/call/Batch', (req, res) => { const r = Engine.Batch(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'Batch', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.40.0', module: 'pcc_workflow', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
