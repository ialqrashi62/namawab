// P3-BU perinatal_ext3 routes v3.33.0
// P3-BU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./perinatal_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.33.0',
    module: 'perinatal_ext3',
    label: 'Perinatal Extended 3',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Anomaly', (req, res) => { const r = Engine.Anomaly(req.body || {}); res.json({ version: '3.33.0', module: 'perinatal_ext3', function: 'Anomaly', plan: r.plan }); })
  router.post('/call/Triploidy', (req, res) => { const r = Engine.Triploidy(req.body || {}); res.json({ version: '3.33.0', module: 'perinatal_ext3', function: 'Triploidy', plan: r.plan }); })
  router.post('/call/Twins', (req, res) => { const r = Engine.Twins(req.body || {}); res.json({ version: '3.33.0', module: 'perinatal_ext3', function: 'Twins', plan: r.plan }); })
  router.post('/call/Previa', (req, res) => { const r = Engine.Previa(req.body || {}); res.json({ version: '3.33.0', module: 'perinatal_ext3', function: 'Previa', plan: r.plan }); })
  router.post('/call/Accreta', (req, res) => { const r = Engine.Accreta(req.body || {}); res.json({ version: '3.33.0', module: 'perinatal_ext3', function: 'Accreta', plan: r.plan }); })
  router.post('/call/Preterm', (req, res) => { const r = Engine.Preterm(req.body || {}); res.json({ version: '3.33.0', module: 'perinatal_ext3', function: 'Preterm', plan: r.plan }); })
  router.post('/call/ROM', (req, res) => { const r = Engine.ROM(req.body || {}); res.json({ version: '3.33.0', module: 'perinatal_ext3', function: 'ROM', plan: r.plan }); })
  router.post('/call/Induction', (req, res) => { const r = Engine.Induction(req.body || {}); res.json({ version: '3.33.0', module: 'perinatal_ext3', function: 'Induction', plan: r.plan }); })
  router.post('/call/Postdates', (req, res) => { const r = Engine.Postdates(req.body || {}); res.json({ version: '3.33.0', module: 'perinatal_ext3', function: 'Postdates', plan: r.plan }); })
  router.post('/call/Postpartum', (req, res) => { const r = Engine.Postpartum(req.body || {}); res.json({ version: '3.33.0', module: 'perinatal_ext3', function: 'Postpartum', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.33.0', module: 'perinatal_ext3', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
