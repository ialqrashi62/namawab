// P3-CB pcc_compliance routes v3.40.0
// P3-CB: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_compliance_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.40.0',
    module: 'pcc_compliance',
    label: 'PCC Compliance',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/HIPAA', (req, res) => { const r = Engine.HIPAA(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'HIPAA', plan: r.plan }); })
  router.post('/call/NPHIES', (req, res) => { const r = Engine.NPHIES(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'NPHIES', plan: r.plan }); })
  router.post('/call/ZATCA', (req, res) => { const r = Engine.ZATCA(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'ZATCA', plan: r.plan }); })
  router.post('/call/PDPL', (req, res) => { const r = Engine.PDPL(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'PDPL', plan: r.plan }); })
  router.post('/call/CBAHI', (req, res) => { const r = Engine.CBAHI(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'CBAHI', plan: r.plan }); })
  router.post('/call/Audit', (req, res) => { const r = Engine.Audit(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'Audit', plan: r.plan }); })
  router.post('/call/Consent', (req, res) => { const r = Engine.Consent(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'Consent', plan: r.plan }); })
  router.post('/call/Breach', (req, res) => { const r = Engine.Breach(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'Breach', plan: r.plan }); })
  router.post('/call/Access', (req, res) => { const r = Engine.Access(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'Access', plan: r.plan }); })
  router.post('/call/Retention', (req, res) => { const r = Engine.Retention(req.body || {}); res.json({ version: '3.40.0', module: 'pcc_compliance', function: 'Retention', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.40.0', module: 'pcc_compliance', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
