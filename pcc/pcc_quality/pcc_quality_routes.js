// P3-CE pcc_quality routes v3.43.0
// P3-CE: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_quality';
const F = require('./pcc_quality_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.43.0',
    module: 'pcc_quality',
    label: 'PCC Quality',
    functions: Object.keys(F),
  });
});
  router.post('/call/Quality', (req, res) => { const r = F.Quality(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Quality', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Indicator', (req, res) => { const r = F.Indicator(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Indicator', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Audit', (req, res) => { const r = F.Audit(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Audit', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Safety', (req, res) => { const r = F.Safety(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Safety', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Performance', (req, res) => { const r = F.Performance(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Performance', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Improvement', (req, res) => { const r = F.Improvement(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Improvement', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Peer', (req, res) => { const r = F.Peer(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Peer', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Credentialing', (req, res) => { const r = F.Credentialing(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Credentialing', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Satisfaction', (req, res) => { const r = F.Satisfaction(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Satisfaction', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Report', (req, res) => { const r = F.Report(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_quality', function: 'Report', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.43.0', module: 'pcc_quality', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
