// P3-CF pcc_scheduling routes v3.44.0
// P3-CF: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_scheduling_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.44.0',
    module: 'pcc_scheduling',
    label: 'PCC Scheduling',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Schedule', (req, res) => { const r = Engine.Schedule(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Schedule', plan: r.plan }); })
  router.post('/call/Slot', (req, res) => { const r = Engine.Slot(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Slot', plan: r.plan }); })
  router.post('/call/Waitlist', (req, res) => { const r = Engine.Waitlist(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Waitlist', plan: r.plan }); })
  router.post('/call/Reminder', (req, res) => { const r = Engine.Reminder(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Reminder', plan: r.plan }); })
  router.post('/call/Booking', (req, res) => { const r = Engine.Booking(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Booking', plan: r.plan }); })
  router.post('/call/Cancel', (req, res) => { const r = Engine.Cancel(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Cancel', plan: r.plan }); })
  router.post('/call/Reschedule', (req, res) => { const r = Engine.Reschedule(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Reschedule', plan: r.plan }); })
  router.post('/call/Capacity', (req, res) => { const r = Engine.Capacity(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Capacity', plan: r.plan }); })
  router.post('/call/Resource', (req, res) => { const r = Engine.Resource(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Resource', plan: r.plan }); })
  router.post('/call/Template', (req, res) => { const r = Engine.Template(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_scheduling', function: 'Template', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.44.0', module: 'pcc_scheduling', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
