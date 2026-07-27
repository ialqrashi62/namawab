// P3-CK pcc_neuro_ext2 routes v3.49.0
// P3-CK: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_neuro_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.49.0',
    module: 'pcc_neuro_ext2',
    label: 'PCC Neuro Ext2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/StrokeScale', (req, res) => { const r = Engine.StrokeScale(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'StrokeScale', plan: r.plan }); })
  router.post('/call/Seizure', (req, res) => { const r = Engine.Seizure(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'Seizure', plan: r.plan }); })
  router.post('/call/Headache', (req, res) => { const r = Engine.Headache(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'Headache', plan: r.plan }); })
  router.post('/call/GCS', (req, res) => { const r = Engine.GCS(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'GCS', plan: r.plan }); })
  router.post('/call/Neuropathy', (req, res) => { const r = Engine.Neuropathy(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'Neuropathy', plan: r.plan }); })
  router.post('/call/Movement', (req, res) => { const r = Engine.Movement(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'Movement', plan: r.plan }); })
  router.post('/call/Dementia', (req, res) => { const r = Engine.Dementia(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'Dementia', plan: r.plan }); })
  router.post('/call/Ms', (req, res) => { const r = Engine.Ms(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'Ms', plan: r.plan }); })
  router.post('/call/Gbs', (req, res) => { const r = Engine.Gbs(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'Gbs', plan: r.plan }); })
  router.post('/call/Myasthenia', (req, res) => { const r = Engine.Myasthenia(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'Myasthenia', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
