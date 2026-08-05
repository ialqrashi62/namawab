// P3-CE pcc_research routes v3.43.0
// P3-CE: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_research';
const F = require('./pcc_research_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.43.0',
    module: 'pcc_research',
    label: 'PCC Research',
    functions: Object.keys(F),
  });
});
  router.post('/call/Protocol', (req, res) => { const r = F.Protocol(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'Protocol', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Consent', (req, res) => { const r = F.Consent(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'Consent', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/IRB', (req, res) => { const r = F.IRB(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'IRB', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Enrollment', (req, res) => { const r = F.Enrollment(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'Enrollment', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Adverse', (req, res) => { const r = F.Adverse(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'Adverse', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Randomization', (req, res) => { const r = F.Randomization(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'Randomization', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Biostats', (req, res) => { const r = F.Biostats(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'Biostats', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Publication', (req, res) => { const r = F.Publication(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'Publication', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Funding', (req, res) => { const r = F.Funding(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'Funding', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Dataset', (req, res) => { const r = F.Dataset(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_research', function: 'Dataset', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.43.0', module: 'pcc_research', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
