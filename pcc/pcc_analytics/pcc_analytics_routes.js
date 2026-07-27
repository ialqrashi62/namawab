// P3-CB pcc_analytics routes v3.40.0
// P3-CB: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_analytics_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.40.0',
    module: 'pcc_analytics',
    label: 'PCC Analytics',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Aggregate', (req, res) => { const r = Engine.Aggregate(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'Aggregate', plan: r.plan }); })
  router.post('/call/Group', (req, res) => { const r = Engine.Group(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'Group', plan: r.plan }); })
  router.post('/call/Trend', (req, res) => { const r = Engine.Trend(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'Trend', plan: r.plan }); })
  router.post('/call/Anomaly', (req, res) => { const r = Engine.Anomaly(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'Anomaly', plan: r.plan }); })
  router.post('/call/Cohort', (req, res) => { const r = Engine.Cohort(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'Cohort', plan: r.plan }); })
  router.post('/call/Funnel', (req, res) => { const r = Engine.Funnel(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'Funnel', plan: r.plan }); })
  router.post('/call/Retention', (req, res) => { const r = Engine.Retention(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'Retention', plan: r.plan }); })
  router.post('/call/Conversion', (req, res) => { const r = Engine.Conversion(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'Conversion', plan: r.plan }); })
  router.post('/call/KPI', (req, res) => { const r = Engine.KPI(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'KPI', plan: r.plan }); })
  router.post('/call/Report', (req, res) => { const r = Engine.Report(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'Report', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.40.0', module: 'pcc_analytics', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
