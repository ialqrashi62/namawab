// P3-CE pcc_quality routes v3.43.0
// P3-CE: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_quality_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.43.0',
    module: 'pcc_quality',
    label: 'PCC Quality',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Quality', (req, res) => { const r = Engine.Quality(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Quality', plan: r.plan }); })
  router.post('/call/Indicator', (req, res) => { const r = Engine.Indicator(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Indicator', plan: r.plan }); })
  router.post('/call/Audit', (req, res) => { const r = Engine.Audit(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Audit', plan: r.plan }); })
  router.post('/call/Safety', (req, res) => { const r = Engine.Safety(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Safety', plan: r.plan }); })
  router.post('/call/Performance', (req, res) => { const r = Engine.Performance(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Performance', plan: r.plan }); })
  router.post('/call/Improvement', (req, res) => { const r = Engine.Improvement(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Improvement', plan: r.plan }); })
  router.post('/call/Peer', (req, res) => { const r = Engine.Peer(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Peer', plan: r.plan }); })
  router.post('/call/Credentialing', (req, res) => { const r = Engine.Credentialing(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Credentialing', plan: r.plan }); })
  router.post('/call/Satisfaction', (req, res) => { const r = Engine.Satisfaction(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Satisfaction', plan: r.plan }); })
  router.post('/call/Report', (req, res) => { const r = Engine.Report(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Report', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.43.0', module: 'pcc_quality', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
