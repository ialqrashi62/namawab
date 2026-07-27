// P3-BY cv_ext3 routes v3.37.0
// P3-BY: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./cv_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.37.0',
    module: 'cv_ext3',
    label: 'Cerebrovascular Extended 3',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Stroke', (req, res) => { const r = Engine.Stroke(req.body || {}); res.json({ version: '3.37.0', module: 'cv_ext3', function: 'Stroke', plan: r.plan }); })
  router.post('/call/TIA', (req, res) => { const r = Engine.TIA(req.body || {}); res.json({ version: '3.37.0', module: 'cv_ext3', function: 'TIA', plan: r.plan }); })
  router.post('/call/SAH', (req, res) => { const r = Engine.SAH(req.body || {}); res.json({ version: '3.37.0', module: 'cv_ext3', function: 'SAH', plan: r.plan }); })
  router.post('/call/Aneurysm', (req, res) => { const r = Engine.Aneurysm(req.body || {}); res.json({ version: '3.37.0', module: 'cv_ext3', function: 'Aneurysm', plan: r.plan }); })
  router.post('/call/AVM', (req, res) => { const r = Engine.AVM(req.body || {}); res.json({ version: '3.37.0', module: 'cv_ext3', function: 'AVM', plan: r.plan }); })
  router.post('/call/Carotid', (req, res) => { const r = Engine.Carotid(req.body || {}); res.json({ version: '3.37.0', module: 'cv_ext3', function: 'Carotid', plan: r.plan }); })
  router.post('/call/ICP', (req, res) => { const r = Engine.ICP(req.body || {}); res.json({ version: '3.37.0', module: 'cv_ext3', function: 'ICP', plan: r.plan }); })
  router.post('/call/Seizure', (req, res) => { const r = Engine.Seizure(req.body || {}); res.json({ version: '3.37.0', module: 'cv_ext3', function: 'Seizure', plan: r.plan }); })
  router.post('/call/MS', (req, res) => { const r = Engine.MS(req.body || {}); res.json({ version: '3.37.0', module: 'cv_ext3', function: 'MS', plan: r.plan }); })
  router.post('/call/Park', (req, res) => { const r = Engine.Park(req.body || {}); res.json({ version: '3.37.0', module: 'cv_ext3', function: 'Park', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.37.0', module: 'cv_ext3', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
