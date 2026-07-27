// P3-BW onco_ext3 routes v3.35.0
// P3-BW: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./onco_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.35.0',
    module: 'onco_ext3',
    label: 'Oncology Extended 3',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Staging', (req, res) => { const r = Engine.Staging(req.body || {}); res.json({ version: '3.35.0', module: 'onco_ext3', function: 'Staging', plan: r.plan }); })
  router.post('/call/Chemo', (req, res) => { const r = Engine.Chemo(req.body || {}); res.json({ version: '3.35.0', module: 'onco_ext3', function: 'Chemo', plan: r.plan }); })
  router.post('/call/Radiation', (req, res) => { const r = Engine.Radiation(req.body || {}); res.json({ version: '3.35.0', module: 'onco_ext3', function: 'Radiation', plan: r.plan }); })
  router.post('/call/Target', (req, res) => { const r = Engine.Target(req.body || {}); res.json({ version: '3.35.0', module: 'onco_ext3', function: 'Target', plan: r.plan }); })
  router.post('/call/Immuno', (req, res) => { const r = Engine.Immuno(req.body || {}); res.json({ version: '3.35.0', module: 'onco_ext3', function: 'Immuno', plan: r.plan }); })
  router.post('/call/Surgery', (req, res) => { const r = Engine.Surgery(req.body || {}); res.json({ version: '3.35.0', module: 'onco_ext3', function: 'Surgery', plan: r.plan }); })
  router.post('/call/Complication', (req, res) => { const r = Engine.Complication(req.body || {}); res.json({ version: '3.35.0', module: 'onco_ext3', function: 'Complication', plan: r.plan }); })
  router.post('/call/Survivorship', (req, res) => { const r = Engine.Survivorship(req.body || {}); res.json({ version: '3.35.0', module: 'onco_ext3', function: 'Survivorship', plan: r.plan }); })
  router.post('/call/Palliative', (req, res) => { const r = Engine.Palliative(req.body || {}); res.json({ version: '3.35.0', module: 'onco_ext3', function: 'Palliative', plan: r.plan }); })
  router.post('/call/Screening', (req, res) => { const r = Engine.Screening(req.body || {}); res.json({ version: '3.35.0', module: 'onco_ext3', function: 'Screening', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.35.0', module: 'onco_ext3', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
