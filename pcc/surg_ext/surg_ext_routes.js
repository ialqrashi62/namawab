// P3-BQ surg_ext routes v3.29.0
// P3-BQ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./surg_ext_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.29.0',
    module: 'surg_ext',
    label: 'Surgery Extended',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/PreopRisk', (req, res) => { const r = Engine.PreopRisk(req.body || {}); res.json({ version: '3.29.0', module: 'surg_ext', function: 'PreopRisk', plan: r.plan }); })
  router.post('/call/Wound', (req, res) => { const r = Engine.Wound(req.body || {}); res.json({ version: '3.29.0', module: 'surg_ext', function: 'Wound', plan: r.plan }); })
  router.post('/call/SBO', (req, res) => { const r = Engine.SBO(req.body || {}); res.json({ version: '3.29.0', module: 'surg_ext', function: 'SBO', plan: r.plan }); })
  router.post('/call/Perforation', (req, res) => { const r = Engine.Perforation(req.body || {}); res.json({ version: '3.29.0', module: 'surg_ext', function: 'Perforation', plan: r.plan }); })
  router.post('/call/Cholecystitis', (req, res) => { const r = Engine.Cholecystitis(req.body || {}); res.json({ version: '3.29.0', module: 'surg_ext', function: 'Cholecystitis', plan: r.plan }); })
  router.post('/call/Appendicitis', (req, res) => { const r = Engine.Appendicitis(req.body || {}); res.json({ version: '3.29.0', module: 'surg_ext', function: 'Appendicitis', plan: r.plan }); })
  router.post('/call/Hernia', (req, res) => { const r = Engine.Hernia(req.body || {}); res.json({ version: '3.29.0', module: 'surg_ext', function: 'Hernia', plan: r.plan }); })
  router.post('/call/TraumaLap', (req, res) => { const r = Engine.TraumaLap(req.body || {}); res.json({ version: '3.29.0', module: 'surg_ext', function: 'TraumaLap', plan: r.plan }); })
  router.post('/call/Postop', (req, res) => { const r = Engine.Postop(req.body || {}); res.json({ version: '3.29.0', module: 'surg_ext', function: 'Postop', plan: r.plan }); })
  router.post('/call/Bariatric', (req, res) => { const r = Engine.Bariatric(req.body || {}); res.json({ version: '3.29.0', module: 'surg_ext', function: 'Bariatric', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.29.0', module: 'surg_ext', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
