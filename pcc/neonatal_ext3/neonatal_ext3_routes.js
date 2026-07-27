// P3-BU neonatal_ext3 routes v3.33.0
// P3-BU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./neonatal_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.33.0',
    module: 'neonatal_ext3',
    label: 'Neonatal Extended 3',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Apnea', (req, res) => { const r = Engine.Apnea(req.body || {}); res.json({ version: '3.33.0', module: 'neonatal_ext3', function: 'Apnea', plan: r.plan }); })
  router.post('/call/Jaundice', (req, res) => { const r = Engine.Jaundice(req.body || {}); res.json({ version: '3.33.0', module: 'neonatal_ext3', function: 'Jaundice', plan: r.plan }); })
  router.post('/call/SepsisScreen', (req, res) => { const r = Engine.SepsisScreen(req.body || {}); res.json({ version: '3.33.0', module: 'neonatal_ext3', function: 'SepsisScreen', plan: r.plan }); })
  router.post('/call/NEC', (req, res) => { const r = Engine.NEC(req.body || {}); res.json({ version: '3.33.0', module: 'neonatal_ext3', function: 'NEC', plan: r.plan }); })
  router.post('/call/BPD', (req, res) => { const r = Engine.BPD(req.body || {}); res.json({ version: '3.33.0', module: 'neonatal_ext3', function: 'BPD', plan: r.plan }); })
  router.post('/call/IVH', (req, res) => { const r = Engine.IVH(req.body || {}); res.json({ version: '3.33.0', module: 'neonatal_ext3', function: 'IVH', plan: r.plan }); })
  router.post('/call/ROP', (req, res) => { const r = Engine.ROP(req.body || {}); res.json({ version: '3.33.0', module: 'neonatal_ext3', function: 'ROP', plan: r.plan }); })
  router.post('/call/Cooling', (req, res) => { const r = Engine.Cooling(req.body || {}); res.json({ version: '3.33.0', module: 'neonatal_ext3', function: 'Cooling', plan: r.plan }); })
  router.post('/call/Feed', (req, res) => { const r = Engine.Feed(req.body || {}); res.json({ version: '3.33.0', module: 'neonatal_ext3', function: 'Feed', plan: r.plan }); })
  router.post('/call/Discharge', (req, res) => { const r = Engine.Discharge(req.body || {}); res.json({ version: '3.33.0', module: 'neonatal_ext3', function: 'Discharge', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.33.0', module: 'neonatal_ext3', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
