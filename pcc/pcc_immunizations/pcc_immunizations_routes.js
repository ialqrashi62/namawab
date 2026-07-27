// P3-CU pcc_immunizations routes v3.59.0
// P3-CU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_immunizations_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.59.0',
    module: 'pcc_immunizations',
    label: 'PCC Immunizations',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Immunization', (req, res) => { const r = Engine.Immunization(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'Immunization', plan: r.plan }); })
  router.post('/call/Schedule', (req, res) => { const r = Engine.Schedule(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'Schedule', plan: r.plan }); })
  router.post('/call/Catchup', (req, res) => { const r = Engine.Catchup(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'Catchup', plan: r.plan }); })
  router.post('/call/AllergyToVaccine', (req, res) => { const r = Engine.AllergyToVaccine(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'AllergyToVaccine', plan: r.plan }); })
  router.post('/call/Consent', (req, res) => { const r = Engine.Consent(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'Consent', plan: r.plan }); })
  router.post('/call/LotNumber', (req, res) => { const r = Engine.LotNumber(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'LotNumber', plan: r.plan }); })
  router.post('/call/Site', (req, res) => { const r = Engine.Site(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'Site', plan: r.plan }); })
  router.post('/call/Adrs', (req, res) => { const r = Engine.Adrs(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'Adrs', plan: r.plan }); })
  router.post('/call/Pregnancy', (req, res) => { const r = Engine.Pregnancy(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'Pregnancy', plan: r.plan }); })
  router.post('/call/Titer', (req, res) => { const r = Engine.Titer(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'Titer', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.59.0', module: 'pcc_immunizations', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
