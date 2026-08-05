// P3-CD pcc_infection routes v3.42.0
// P3-CD: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_infection';
const F = require('./pcc_infection_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.42.0',
    module: 'pcc_infection',
    label: 'PCC Infection',
    functions: Object.keys(F),
  });
});
  router.post('/call/Source', (req, res) => { const r = F.Source(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Source', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Severity', (req, res) => { const r = F.Severity(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Severity', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Cultures', (req, res) => { const r = F.Cultures(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Cultures', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Empiric', (req, res) => { const r = F.Empiric(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Empiric', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Deescalation', (req, res) => { const r = F.Deescalation(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Deescalation', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Duration', (req, res) => { const r = F.Duration(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Duration', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Prophylaxis', (req, res) => { const r = F.Prophylaxis(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Prophylaxis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Resistance', (req, res) => { const r = F.Resistance(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Resistance', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Outbreak', (req, res) => { const r = F.Outbreak(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Outbreak', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Isolation', (req, res) => { const r = F.Isolation(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Isolation', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.42.0', module: 'pcc_infection', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
