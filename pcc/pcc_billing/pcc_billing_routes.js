// P3-CF pcc_billing routes v3.44.0
// P3-CF: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_billing';
const F = require('./pcc_billing_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.44.0',
    module: 'pcc_billing',
    label: 'PCC Billing',
    functions: Object.keys(F),
  });
});
  router.post('/call/Billing', (req, res) => { const r = F.Billing(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Billing', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Charge', (req, res) => { const r = F.Charge(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Charge', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Insurance', (req, res) => { const r = F.Insurance(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Insurance', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Discount', (req, res) => { const r = F.Discount(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Discount', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Payment', (req, res) => { const r = F.Payment(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Payment', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Refund', (req, res) => { const r = F.Refund(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Refund', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Statement', (req, res) => { const r = F.Statement(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Statement', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Denial', (req, res) => { const r = F.Denial(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Denial', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Reclaim', (req, res) => { const r = F.Reclaim(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Reclaim', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Tax', (req, res) => { const r = F.Tax(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_billing', function: 'Tax', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.44.0', module: 'pcc_billing', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
