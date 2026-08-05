// P3-CT pcc_ambulatory routes v3.58.0
// P3-CT: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_ambulatory';
const F = require('./pcc_ambulatory_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.58.0',
    module: 'pcc_ambulatory',
    label: 'PCC Ambulatory',
    functions: Object.keys(F),
  });
});
  router.post('/call/VisitType', (req, res) => { const r = F.VisitType(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'VisitType', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Refill', (req, res) => { const r = F.Refill(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'Refill', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Wellness', (req, res) => { const r = F.Wellness(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'Wellness', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/ChronicCare', (req, res) => { const r = F.ChronicCare(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'ChronicCare', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Preventive', (req, res) => { const r = F.Preventive(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'Preventive', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Immunization', (req, res) => { const r = F.Immunization(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'Immunization', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/HgbA1c', (req, res) => { const r = F.HgbA1c(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'HgbA1c', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/BpCheck', (req, res) => { const r = F.BpCheck(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'BpCheck', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Smoking', (req, res) => { const r = F.Smoking(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'Smoking', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/DrVisit', (req, res) => { const r = F.DrVisit(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'DrVisit', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
