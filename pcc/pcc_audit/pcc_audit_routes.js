// P3-CA pcc_audit routes v3.39.0
// P3-CA: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_audit_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.39.0',
    module: 'pcc_audit',
    label: 'PCC Audit',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Log', (req, res) => { const r = Engine.Log(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Log', plan: r.plan }); })
  router.post('/call/Compliance', (req, res) => { const r = Engine.Compliance(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Compliance', plan: r.plan }); })
  router.post('/call/Retention', (req, res) => { const r = Engine.Retention(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Retention', plan: r.plan }); })
  router.post('/call/Hash', (req, res) => { const r = Engine.Hash(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Hash', plan: r.plan }); })
  router.post('/call/Search', (req, res) => { const r = Engine.Search(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Search', plan: r.plan }); })
  router.post('/call/Filter', (req, res) => { const r = Engine.Filter(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Filter', plan: r.plan }); })
  router.post('/call/Range', (req, res) => { const r = Engine.Range(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Range', plan: r.plan }); })
  router.post('/call/Export', (req, res) => { const r = Engine.Export(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Export', plan: r.plan }); })
  router.post('/call/Alert', (req, res) => { const r = Engine.Alert(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Alert', plan: r.plan }); })
  router.post('/call/Quota', (req, res) => { const r = Engine.Quota(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Quota', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.39.0', module: 'pcc_audit', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
