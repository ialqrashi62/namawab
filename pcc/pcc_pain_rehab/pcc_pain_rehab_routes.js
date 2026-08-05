// P3-CZ pcc_pain_rehab routes v3.64.0
// P3-CZ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_pain_rehab';
const F = require('./pcc_pain_rehab_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.64.0',
    module: 'pcc_pain_rehab',
    label: 'PCC Pain Rehabilitation',
    functions: Object.keys(F),
  });
});
  router.post('/call/PainAdmission', (req, res) => { const r = F.PainAdmission(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'PainAdmission', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Multidisciplinary', (req, res) => { const r = F.Multidisciplinary(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'Multidisciplinary', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/PhysicalTherapy', (req, res) => { const r = F.PhysicalTherapy(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'PhysicalTherapy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/OccupationalTherapy', (req, res) => { const r = F.OccupationalTherapy(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'OccupationalTherapy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Psychology', (req, res) => { const r = F.Psychology(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'Psychology', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Interventional', (req, res) => { const r = F.Interventional(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'Interventional', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/MedicationTaper', (req, res) => { const r = F.MedicationTaper(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'MedicationTaper', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/FunctionalRestoration', (req, res) => { const r = F.FunctionalRestoration(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'FunctionalRestoration', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Discharge', (req, res) => { const r = F.Discharge(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'Discharge', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/RelapsePrevention', (req, res) => { const r = F.RelapsePrevention(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: 'RelapsePrevention', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.64.0', module: 'pcc_pain_rehab', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
