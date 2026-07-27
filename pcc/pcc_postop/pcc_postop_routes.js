// P3-CH pcc_postop routes v3.46.0
// P3-CH: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_postop_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.46.0',
    module: 'pcc_postop',
    label: 'PCC Postop',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Pacu', (req, res) => { const r = Engine.Pacu(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'Pacu', plan: r.plan }); })
  router.post('/call/Pain', (req, res) => { const r = Engine.Pain(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'Pain', plan: r.plan }); })
  router.post('/call/Nausea', (req, res) => { const r = Engine.Nausea(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'Nausea', plan: r.plan }); })
  router.post('/call/Diet', (req, res) => { const r = Engine.Diet(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'Diet', plan: r.plan }); })
  router.post('/call/Activity', (req, res) => { const r = Engine.Activity(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'Activity', plan: r.plan }); })
  router.post('/call/Dvt', (req, res) => { const r = Engine.Dvt(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'Dvt', plan: r.plan }); })
  router.post('/call/Wound', (req, res) => { const r = Engine.Wound(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'Wound', plan: r.plan }); })
  router.post('/call/Drain', (req, res) => { const r = Engine.Drain(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'Drain', plan: r.plan }); })
  router.post('/call/Discharge', (req, res) => { const r = Engine.Discharge(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'Discharge', plan: r.plan }); })
  router.post('/call/FollowUp', (req, res) => { const r = Engine.FollowUp(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'FollowUp', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.46.0', module: 'pcc_postop', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
