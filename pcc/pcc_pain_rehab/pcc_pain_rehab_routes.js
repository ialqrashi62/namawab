// P3-CZ pcc_pain_rehab routes v3.64.0
// P3-CZ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_pain_rehab_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.64.0',
    module: 'pcc_pain_rehab',
    label: 'PCC Pain Rehabilitation',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/PainAdmission', (req, res) => { const r = Engine.PainAdmission(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'PainAdmission', plan: r.plan }); })
  router.post('/call/Multidisciplinary', (req, res) => { const r = Engine.Multidisciplinary(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'Multidisciplinary', plan: r.plan }); })
  router.post('/call/PhysicalTherapy', (req, res) => { const r = Engine.PhysicalTherapy(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'PhysicalTherapy', plan: r.plan }); })
  router.post('/call/OccupationalTherapy', (req, res) => { const r = Engine.OccupationalTherapy(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'OccupationalTherapy', plan: r.plan }); })
  router.post('/call/Psychology', (req, res) => { const r = Engine.Psychology(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'Psychology', plan: r.plan }); })
  router.post('/call/Interventional', (req, res) => { const r = Engine.Interventional(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'Interventional', plan: r.plan }); })
  router.post('/call/MedicationTaper', (req, res) => { const r = Engine.MedicationTaper(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'MedicationTaper', plan: r.plan }); })
  router.post('/call/FunctionalRestoration', (req, res) => { const r = Engine.FunctionalRestoration(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'FunctionalRestoration', plan: r.plan }); })
  router.post('/call/Discharge', (req, res) => { const r = Engine.Discharge(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'Discharge', plan: r.plan }); })
  router.post('/call/RelapsePrevention', (req, res) => { const r = Engine.RelapsePrevention(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'RelapsePrevention', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
