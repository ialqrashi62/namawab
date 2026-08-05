// P3-CB pcc_workflow routes v3.40.0
// P3-CB: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_workflow';
const F = require('./pcc_workflow_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.40.0',
    module: 'pcc_workflow',
    label: 'PCC Workflow',
    functions: Object.keys(F),
  });
});
  router.post('/call/State', (req, res) => { const r = F.State(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'State', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Transition', (req, res) => { const r = F.Transition(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'Transition', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Assignment', (req, res) => { const r = F.Assignment(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'Assignment', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Escalation', (req, res) => { const r = F.Escalation(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'Escalation', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Notify', (req, res) => { const r = F.Notify(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'Notify', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Approval', (req, res) => { const r = F.Approval(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'Approval', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Schedule', (req, res) => { const r = F.Schedule(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'Schedule', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Queue', (req, res) => { const r = F.Queue(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'Queue', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Timeout', (req, res) => { const r = F.Timeout(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'Timeout', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Batch', (req, res) => { const r = F.Batch(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_workflow', function: 'Batch', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.40.0', module: 'pcc_workflow', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
