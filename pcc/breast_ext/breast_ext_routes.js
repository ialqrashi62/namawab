// P3-BT breast_ext routes v3.32.0
// P3-BT: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./breast_ext_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.32.0',
    module: 'breast_ext',
    label: 'Breast Extended',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Screen', (req, res) => { const r = Engine.Screen(req.body || {}); res.json({ version: '3.32.0', module: 'breast_ext', function: 'Screen', plan: r.plan }); })
  router.post('/call/Mass', (req, res) => { const r = Engine.Mass(req.body || {}); res.json({ version: '3.32.0', module: 'breast_ext', function: 'Mass', plan: r.plan }); })
  router.post('/call/Nipple', (req, res) => { const r = Engine.Nipple(req.body || {}); res.json({ version: '3.32.0', module: 'breast_ext', function: 'Nipple', plan: r.plan }); })
  router.post('/call/Cancer', (req, res) => { const r = Engine.Cancer(req.body || {}); res.json({ version: '3.32.0', module: 'breast_ext', function: 'Cancer', plan: r.plan }); })
  router.post('/call/BRCA', (req, res) => { const r = Engine.BRCA(req.body || {}); res.json({ version: '3.32.0', module: 'breast_ext', function: 'BRCA', plan: r.plan }); })
  router.post('/call/Mastectomy', (req, res) => { const r = Engine.Mastectomy(req.body || {}); res.json({ version: '3.32.0', module: 'breast_ext', function: 'Mastectomy', plan: r.plan }); })
  router.post('/call/Reconstruction', (req, res) => { const r = Engine.Reconstruction(req.body || {}); res.json({ version: '3.32.0', module: 'breast_ext', function: 'Reconstruction', plan: r.plan }); })
  router.post('/call/Lactation', (req, res) => { const r = Engine.Lactation(req.body || {}); res.json({ version: '3.32.0', module: 'breast_ext', function: 'Lactation', plan: r.plan }); })
  router.post('/call/Gynecomastia', (req, res) => { const r = Engine.Gynecomastia(req.body || {}); res.json({ version: '3.32.0', module: 'breast_ext', function: 'Gynecomastia', plan: r.plan }); })
  router.post('/call/Survivorship', (req, res) => { const r = Engine.Survivorship(req.body || {}); res.json({ version: '3.32.0', module: 'breast_ext', function: 'Survivorship', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.32.0', module: 'breast_ext', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
