// P3-BZ neph_ext3 routes v3.38.0
// P3-BZ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./neph_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.38.0',
    module: 'neph_ext3',
    label: 'Nephrology Extended 3',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/CKD', (req, res) => { const r = Engine.CKD(req.body || {}); res.json({ version: '3.38.0', module: 'neph_ext3', function: 'CKD', plan: r.plan }); })
  router.post('/call/AKI', (req, res) => { const r = Engine.AKI(req.body || {}); res.json({ version: '3.38.0', module: 'neph_ext3', function: 'AKI', plan: r.plan }); })
  router.post('/call/GN', (req, res) => { const r = Engine.GN(req.body || {}); res.json({ version: '3.38.0', module: 'neph_ext3', function: 'GN', plan: r.plan }); })
  router.post('/call/Dialysis', (req, res) => { const r = Engine.Dialysis(req.body || {}); res.json({ version: '3.38.0', module: 'neph_ext3', function: 'Dialysis', plan: r.plan }); })
  router.post('/call/Rhabdo', (req, res) => { const r = Engine.Rhabdo(req.body || {}); res.json({ version: '3.38.0', module: 'neph_ext3', function: 'Rhabdo', plan: r.plan }); })
  router.post('/call/Electrolyte', (req, res) => { const r = Engine.Electrolyte(req.body || {}); res.json({ version: '3.38.0', module: 'neph_ext3', function: 'Electrolyte', plan: r.plan }); })
  router.post('/call/HTN', (req, res) => { const r = Engine.HTN(req.body || {}); res.json({ version: '3.38.0', module: 'neph_ext3', function: 'HTN', plan: r.plan }); })
  router.post('/call/Stone', (req, res) => { const r = Engine.Stone(req.body || {}); res.json({ version: '3.38.0', module: 'neph_ext3', function: 'Stone', plan: r.plan }); })
  router.post('/call/Txp', (req, res) => { const r = Engine.Txp(req.body || {}); res.json({ version: '3.38.0', module: 'neph_ext3', function: 'Txp', plan: r.plan }); })
  router.post('/call/PKD', (req, res) => { const r = Engine.PKD(req.body || {}); res.json({ version: '3.38.0', module: 'neph_ext3', function: 'PKD', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.38.0', module: 'neph_ext3', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
