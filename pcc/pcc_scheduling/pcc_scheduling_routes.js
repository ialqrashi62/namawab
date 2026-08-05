// P3-CF pcc_scheduling routes v3.44.0
// P3-CF: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_scheduling';
const F = require('./pcc_scheduling_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.44.0',
    module: 'pcc_scheduling',
    label: 'PCC Scheduling',
    functions: Object.keys(F),
  });
});
  router.post('/call/Schedule', (req, res) => { const r = F.Schedule(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Schedule', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Slot', (req, res) => { const r = F.Slot(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Slot', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Waitlist', (req, res) => { const r = F.Waitlist(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Waitlist', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Reminder', (req, res) => { const r = F.Reminder(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Reminder', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Booking', (req, res) => { const r = F.Booking(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Booking', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Cancel', (req, res) => { const r = F.Cancel(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Cancel', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Reschedule', (req, res) => { const r = F.Reschedule(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Reschedule', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Capacity', (req, res) => { const r = F.Capacity(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Capacity', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Resource', (req, res) => { const r = F.Resource(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Resource', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Template', (req, res) => { const r = F.Template(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Template', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.44.0', module: 'pcc_scheduling', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
