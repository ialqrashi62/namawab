// P3-CU pcc_immunizations routes v3.59.0
// P3-CU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_immunizations';
const F = require('./pcc_immunizations_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.59.0',
    module: 'pcc_immunizations',
    label: 'PCC Immunizations',
    functions: Object.keys(F),
  });
});
  router.post('/call/Immunization', (req, res) => { const r = F.Immunization(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'Immunization', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Schedule', (req, res) => { const r = F.Schedule(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'Schedule', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Catchup', (req, res) => { const r = F.Catchup(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'Catchup', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/AllergyToVaccine', (req, res) => { const r = F.AllergyToVaccine(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'AllergyToVaccine', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Consent', (req, res) => { const r = F.Consent(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'Consent', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/LotNumber', (req, res) => { const r = F.LotNumber(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'LotNumber', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Site', (req, res) => { const r = F.Site(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'Site', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Adrs', (req, res) => { const r = F.Adrs(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'Adrs', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Pregnancy', (req, res) => { const r = F.Pregnancy(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'Pregnancy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Titer', (req, res) => { const r = F.Titer(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_immunizations', function: 'Titer', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.59.0', module: 'pcc_immunizations', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
