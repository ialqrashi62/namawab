// P3-CE pcc_research routes v3.43.0
// P3-CE: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_research_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.43.0',
    module: 'pcc_research',
    label: 'PCC Research',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Protocol', (req, res) => { const r = Engine.Protocol(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'Protocol', plan: r.plan }); })
  router.post('/call/Consent', (req, res) => { const r = Engine.Consent(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'Consent', plan: r.plan }); })
  router.post('/call/IRB', (req, res) => { const r = Engine.IRB(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'IRB', plan: r.plan }); })
  router.post('/call/Enrollment', (req, res) => { const r = Engine.Enrollment(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'Enrollment', plan: r.plan }); })
  router.post('/call/Adverse', (req, res) => { const r = Engine.Adverse(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'Adverse', plan: r.plan }); })
  router.post('/call/Randomization', (req, res) => { const r = Engine.Randomization(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'Randomization', plan: r.plan }); })
  router.post('/call/Biostats', (req, res) => { const r = Engine.Biostats(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'Biostats', plan: r.plan }); })
  router.post('/call/Publication', (req, res) => { const r = Engine.Publication(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'Publication', plan: r.plan }); })
  router.post('/call/Funding', (req, res) => { const r = Engine.Funding(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'Funding', plan: r.plan }); })
  router.post('/call/Dataset', (req, res) => { const r = Engine.Dataset(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'Dataset', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.43.0', module: 'pcc_research', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
