// P3-CA pcc_audit routes v3.39.0
// P3-CA: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_audit';
const F = require('./pcc_audit_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.39.0',
    module: 'pcc_audit',
    label: 'PCC Audit',
    functions: Object.keys(F),
  });
});
  router.post('/call/Log', (req, res) => { const r = F.Log(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Log', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Compliance', (req, res) => { const r = F.Compliance(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Compliance', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Retention', (req, res) => { const r = F.Retention(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Retention', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Hash', (req, res) => { const r = F.Hash(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Hash', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Search', (req, res) => { const r = F.Search(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Search', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Filter', (req, res) => { const r = F.Filter(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Filter', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Range', (req, res) => { const r = F.Range(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Range', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Export', (req, res) => { const r = F.Export(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Export', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Alert', (req, res) => { const r = F.Alert(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Alert', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Quota', (req, res) => { const r = F.Quota(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_audit', function: 'Quota', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.39.0', module: 'pcc_audit', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
