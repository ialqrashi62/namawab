// P3-CB pcc_compliance routes v3.40.0
// P3-CB: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_compliance';
const F = require('./pcc_compliance_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.40.0',
    module: 'pcc_compliance',
    label: 'PCC Compliance',
    functions: Object.keys(F),
  });
});
  router.post('/call/HIPAA', (req, res) => { const r = F.HIPAA(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'HIPAA', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/NPHIES', (req, res) => { const r = F.NPHIES(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'NPHIES', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/ZATCA', (req, res) => { const r = F.ZATCA(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'ZATCA', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/PDPL', (req, res) => { const r = F.PDPL(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'PDPL', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/CBAHI', (req, res) => { const r = F.CBAHI(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'CBAHI', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Audit', (req, res) => { const r = F.Audit(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'Audit', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Consent', (req, res) => { const r = F.Consent(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'Consent', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Breach', (req, res) => { const r = F.Breach(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'Breach', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Access', (req, res) => { const r = F.Access(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'Access', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Retention', (req, res) => { const r = F.Retention(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'Retention', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.40.0', module: 'pcc_compliance', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
