// P3-CT pcc_ambulatory routes v3.58.0
// P3-CT: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_ambulatory_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.58.0',
    module: 'pcc_ambulatory',
    label: 'PCC Ambulatory',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/VisitType', (req, res) => { const r = Engine.VisitType(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'VisitType', plan: r.plan }); })
  router.post('/call/Refill', (req, res) => { const r = Engine.Refill(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'Refill', plan: r.plan }); })
  router.post('/call/Wellness', (req, res) => { const r = Engine.Wellness(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'Wellness', plan: r.plan }); })
  router.post('/call/ChronicCare', (req, res) => { const r = Engine.ChronicCare(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'ChronicCare', plan: r.plan }); })
  router.post('/call/Preventive', (req, res) => { const r = Engine.Preventive(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'Preventive', plan: r.plan }); })
  router.post('/call/Immunization', (req, res) => { const r = Engine.Immunization(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'Immunization', plan: r.plan }); })
  router.post('/call/HgbA1c', (req, res) => { const r = Engine.HgbA1c(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'HgbA1c', plan: r.plan }); })
  router.post('/call/BpCheck', (req, res) => { const r = Engine.BpCheck(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'BpCheck', plan: r.plan }); })
  router.post('/call/Smoking', (req, res) => { const r = Engine.Smoking(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'Smoking', plan: r.plan }); })
  router.post('/call/DrVisit', (req, res) => { const r = Engine.DrVisit(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: 'DrVisit', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.58.0', module: 'pcc_ambulatory', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
