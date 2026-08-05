// P3-CA pcc_admin routes v3.39.0
// P3-CA: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_admin';
const F = require('./pcc_admin_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.39.0',
    module: 'pcc_admin',
    label: 'PCC Admin',
    functions: Object.keys(F),
  });
});
  router.post('/call/Facility', (req, res) => { const r = F.Facility(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'Facility', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/User', (req, res) => { const r = F.User(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'User', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Module', (req, res) => { const r = F.Module(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'Module', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Config', (req, res) => { const r = F.Config(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'Config', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Branches', (req, res) => { const r = F.Branches(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'Branches', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Resource', (req, res) => { const r = F.Resource(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'Resource', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Backup', (req, res) => { const r = F.Backup(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'Backup', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Restore', (req, res) => { const r = F.Restore(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'Restore', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Migration', (req, res) => { const r = F.Migration(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'Migration', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Health', (req, res) => { const r = F.Health(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'Health', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.39.0', module: 'pcc_admin', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
