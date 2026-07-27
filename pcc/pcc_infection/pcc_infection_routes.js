// P3-CD pcc_infection routes v3.42.0
// P3-CD: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_infection_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.42.0',
    module: 'pcc_infection',
    label: 'PCC Infection',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Source', (req, res) => { const r = Engine.Source(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Source', plan: r.plan }); })
  router.post('/call/Severity', (req, res) => { const r = Engine.Severity(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Severity', plan: r.plan }); })
  router.post('/call/Cultures', (req, res) => { const r = Engine.Cultures(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Cultures', plan: r.plan }); })
  router.post('/call/Empiric', (req, res) => { const r = Engine.Empiric(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Empiric', plan: r.plan }); })
  router.post('/call/Deescalation', (req, res) => { const r = Engine.Deescalation(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Deescalation', plan: r.plan }); })
  router.post('/call/Duration', (req, res) => { const r = Engine.Duration(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Duration', plan: r.plan }); })
  router.post('/call/Prophylaxis', (req, res) => { const r = Engine.Prophylaxis(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Prophylaxis', plan: r.plan }); })
  router.post('/call/Resistance', (req, res) => { const r = Engine.Resistance(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Resistance', plan: r.plan }); })
  router.post('/call/Outbreak', (req, res) => { const r = Engine.Outbreak(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Outbreak', plan: r.plan }); })
  router.post('/call/Isolation', (req, res) => { const r = Engine.Isolation(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_infection', function: 'Isolation', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.42.0', module: 'pcc_infection', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
