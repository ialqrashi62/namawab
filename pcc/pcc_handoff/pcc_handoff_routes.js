// P3-CR pcc_handoff routes v3.56.0
// P3-CR: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_handoff_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.56.0',
    module: 'pcc_handoff',
    label: 'PCC Handoff',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Ipass', (req, res) => { const r = Engine.Ipass(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Ipass', plan: r.plan }); })
  router.post('/call/Sbar', (req, res) => { const r = Engine.Sbar(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Sbar', plan: r.plan }); })
  router.post('/call/Shift', (req, res) => { const r = Engine.Shift(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Shift', plan: r.plan }); })
  router.post('/call/Discharge', (req, res) => { const r = Engine.Discharge(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Discharge', plan: r.plan }); })
  router.post('/call/Icu', (req, res) => { const r = Engine.Icu(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Icu', plan: r.plan }); })
  router.post('/call/Or', (req, res) => { const r = Engine.Or(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Or', plan: r.plan }); })
  router.post('/call/Er', (req, res) => { const r = Engine.Er(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Er', plan: r.plan }); })
  router.post('/call/Anesthesia', (req, res) => { const r = Engine.Anesthesia(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Anesthesia', plan: r.plan }); })
  router.post('/call/Primary', (req, res) => { const r = Engine.Primary(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Primary', plan: r.plan }); })
  router.post('/call/Receiving', (req, res) => { const r = Engine.Receiving(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Receiving', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.56.0', module: 'pcc_handoff', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
