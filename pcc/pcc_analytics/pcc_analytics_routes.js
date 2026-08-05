// P3-CB pcc_analytics routes v3.40.0
// P3-CB: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_analytics';
const F = require('./pcc_analytics_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.40.0',
    module: 'pcc_analytics',
    label: 'PCC Analytics',
    functions: Object.keys(F),
  });
});
  router.post('/call/Aggregate', (req, res) => { const r = F.Aggregate(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'Aggregate', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Group', (req, res) => { const r = F.Group(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'Group', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Trend', (req, res) => { const r = F.Trend(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'Trend', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Anomaly', (req, res) => { const r = F.Anomaly(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'Anomaly', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Cohort', (req, res) => { const r = F.Cohort(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'Cohort', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Funnel', (req, res) => { const r = F.Funnel(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'Funnel', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Retention', (req, res) => { const r = F.Retention(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'Retention', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Conversion', (req, res) => { const r = F.Conversion(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'Conversion', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/KPI', (req, res) => { const r = F.KPI(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'KPI', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Report', (req, res) => { const r = F.Report(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_analytics', function: 'Report', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.40.0', module: 'pcc_analytics', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
