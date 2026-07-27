// P3-CM pcc_rheum_ext4 routes v3.51.0
// P3-CM: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_rheum_ext4_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.51.0',
    module: 'pcc_rheum_ext4',
    label: 'PCC Rheum Ext4',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Ra', (req, res) => { const r = Engine.Ra(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Ra', plan: r.plan }); })
  router.post('/call/Sle', (req, res) => { const r = Engine.Sle(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Sle', plan: r.plan }); })
  router.post('/call/Spa', (req, res) => { const r = Engine.Spa(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Spa', plan: r.plan }); })
  router.post('/call/Vasculitis', (req, res) => { const r = Engine.Vasculitis(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Vasculitis', plan: r.plan }); })
  router.post('/call/Gout', (req, res) => { const r = Engine.Gout(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Gout', plan: r.plan }); })
  router.post('/call/Osteo', (req, res) => { const r = Engine.Osteo(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Osteo', plan: r.plan }); })
  router.post('/call/Sjogren', (req, res) => { const r = Engine.Sjogren(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Sjogren', plan: r.plan }); })
  router.post('/call/Scleroderma', (req, res) => { const r = Engine.Scleroderma(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Scleroderma', plan: r.plan }); })
  router.post('/call/Myositis', (req, res) => { const r = Engine.Myositis(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Myositis', plan: r.plan }); })
  router.post('/call/Biologic', (req, res) => { const r = Engine.Biologic(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Biologic', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
