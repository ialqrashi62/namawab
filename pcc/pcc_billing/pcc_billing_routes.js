// P3-CF pcc_billing routes v3.44.0
// P3-CF: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_billing_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.44.0',
    module: 'pcc_billing',
    label: 'PCC Billing',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Billing', (req, res) => { const r = Engine.Billing(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Billing', plan: r.plan }); })
  router.post('/call/Charge', (req, res) => { const r = Engine.Charge(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Charge', plan: r.plan }); })
  router.post('/call/Insurance', (req, res) => { const r = Engine.Insurance(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Insurance', plan: r.plan }); })
  router.post('/call/Discount', (req, res) => { const r = Engine.Discount(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Discount', plan: r.plan }); })
  router.post('/call/Payment', (req, res) => { const r = Engine.Payment(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Payment', plan: r.plan }); })
  router.post('/call/Refund', (req, res) => { const r = Engine.Refund(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Refund', plan: r.plan }); })
  router.post('/call/Statement', (req, res) => { const r = Engine.Statement(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Statement', plan: r.plan }); })
  router.post('/call/Denial', (req, res) => { const r = Engine.Denial(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Denial', plan: r.plan }); })
  router.post('/call/Reclaim', (req, res) => { const r = Engine.Reclaim(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Reclaim', plan: r.plan }); })
  router.post('/call/Tax', (req, res) => { const r = Engine.Tax(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Tax', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.44.0', module: 'pcc_billing', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
