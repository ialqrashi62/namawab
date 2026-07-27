// P3-CF pcc_telemed routes v3.44.0
// P3-CF: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_telemed_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.44.0',
    module: 'pcc_telemed',
    label: 'PCC Telemed',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Visit', (req, res) => { const r = Engine.Visit(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'Visit', plan: r.plan }); })
  router.post('/call/Consent', (req, res) => { const r = Engine.Consent(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'Consent', plan: r.plan }); })
  router.post('/call/Connection', (req, res) => { const r = Engine.Connection(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'Connection', plan: r.plan }); })
  router.post('/call/Prescribe', (req, res) => { const r = Engine.Prescribe(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'Prescribe', plan: r.plan }); })
  router.post('/call/Charting', (req, res) => { const r = Engine.Charting(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'Charting', plan: r.plan }); })
  router.post('/call/Triage', (req, res) => { const r = Engine.Triage(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'Triage', plan: r.plan }); })
  router.post('/call/Reimburse', (req, res) => { const r = Engine.Reimburse(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'Reimburse', plan: r.plan }); })
  router.post('/call/Platform', (req, res) => { const r = Engine.Platform(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'Platform', plan: r.plan }); })
  router.post('/call/FollowUp', (req, res) => { const r = Engine.FollowUp(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'FollowUp', plan: r.plan }); })
  router.post('/call/Audit', (req, res) => { const r = Engine.Audit(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'Audit', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.44.0', module: 'pcc_telemed', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
