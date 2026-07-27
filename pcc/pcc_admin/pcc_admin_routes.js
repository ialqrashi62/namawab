// P3-CA pcc_admin routes v3.39.0
// P3-CA: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_admin_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.39.0',
    module: 'pcc_admin',
    label: 'PCC Admin',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Facility', (req, res) => { const r = Engine.Facility(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'Facility', plan: r.plan }); })
  router.post('/call/User', (req, res) => { const r = Engine.User(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'User', plan: r.plan }); })
  router.post('/call/Module', (req, res) => { const r = Engine.Module(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'Module', plan: r.plan }); })
  router.post('/call/Config', (req, res) => { const r = Engine.Config(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'Config', plan: r.plan }); })
  router.post('/call/Branches', (req, res) => { const r = Engine.Branches(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'Branches', plan: r.plan }); })
  router.post('/call/Resource', (req, res) => { const r = Engine.Resource(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'Resource', plan: r.plan }); })
  router.post('/call/Backup', (req, res) => { const r = Engine.Backup(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'Backup', plan: r.plan }); })
  router.post('/call/Restore', (req, res) => { const r = Engine.Restore(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'Restore', plan: r.plan }); })
  router.post('/call/Migration', (req, res) => { const r = Engine.Migration(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'Migration', plan: r.plan }); })
  router.post('/call/Health', (req, res) => { const r = Engine.Health(req.body || {}); res.json({ version: '3.39.0', module: 'pcc_admin', function: 'Health', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.39.0', module: 'pcc_admin', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
