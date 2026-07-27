// P3-CW pcc_occupational_health routes v3.61.0
// P3-CW: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_occupational_health_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.61.0',
    module: 'pcc_occupational_health',
    label: 'PCC Occupational Health',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Fitness', (req, res) => { const r = Engine.Fitness(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'Fitness', plan: r.plan }); })
  router.post('/call/Exposure', (req, res) => { const r = Engine.Exposure(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'Exposure', plan: r.plan }); })
  router.post('/call/Vaccination', (req, res) => { const r = Engine.Vaccination(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'Vaccination', plan: r.plan }); })
  router.post('/call/Injury', (req, res) => { const r = Engine.Injury(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'Injury', plan: r.plan }); })
  router.post('/call/ReturnToWork', (req, res) => { const r = Engine.ReturnToWork(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'ReturnToWork', plan: r.plan }); })
  router.post('/call/Hearing', (req, res) => { const r = Engine.Hearing(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'Hearing', plan: r.plan }); })
  router.post('/call/Vision', (req, res) => { const r = Engine.Vision(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'Vision', plan: r.plan }); })
  router.post('/call/Respiratory', (req, res) => { const r = Engine.Respiratory(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'Respiratory', plan: r.plan }); })
  router.post('/call/Chemical', (req, res) => { const r = Engine.Chemical(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'Chemical', plan: r.plan }); })
  router.post('/call/Ergonomics', (req, res) => { const r = Engine.Ergonomics(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'Ergonomics', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
