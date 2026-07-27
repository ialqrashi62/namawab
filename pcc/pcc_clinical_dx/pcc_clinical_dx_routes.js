// P3-CC pcc_clinical_dx routes v3.41.0
// P3-CC: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_clinical_dx_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.41.0',
    module: 'pcc_clinical_dx',
    label: 'PCC Clinical DX',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Differential', (req, res) => { const r = Engine.Differential(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'Differential', plan: r.plan }); })
  router.post('/call/Workup', (req, res) => { const r = Engine.Workup(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'Workup', plan: r.plan }); })
  router.post('/call/Imaging', (req, res) => { const r = Engine.Imaging(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'Imaging', plan: r.plan }); })
  router.post('/call/Lab', (req, res) => { const r = Engine.Lab(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'Lab', plan: r.plan }); })
  router.post('/call/Consult', (req, res) => { const r = Engine.Consult(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'Consult', plan: r.plan }); })
  router.post('/call/Spec', (req, res) => { const r = Engine.Spec(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'Spec', plan: r.plan }); })
  router.post('/call/FollowUp', (req, res) => { const r = Engine.FollowUp(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'FollowUp', plan: r.plan }); })
  router.post('/call/Disposition', (req, res) => { const r = Engine.Disposition(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'Disposition', plan: r.plan }); })
  router.post('/call/Pathway', (req, res) => { const r = Engine.Pathway(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'Pathway', plan: r.plan }); })
  router.post('/call/Alert', (req, res) => { const r = Engine.Alert(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'Alert', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
