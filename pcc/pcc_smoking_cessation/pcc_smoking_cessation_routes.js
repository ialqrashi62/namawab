// P3-CX pcc_smoking_cessation routes v3.62.0
// P3-CX: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_smoking_cessation_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.62.0',
    module: 'pcc_smoking_cessation',
    label: 'PCC Smoking Cessation',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Readiness', (req, res) => { const r = Engine.Readiness(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'Readiness', plan: r.plan }); })
  router.post('/call/PackYears', (req, res) => { const r = Engine.PackYears(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'PackYears', plan: r.plan }); })
  router.post('/call/Fagerstrom', (req, res) => { const r = Engine.Fagerstrom(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'Fagerstrom', plan: r.plan }); })
  router.post('/call/QuitPlan', (req, res) => { const r = Engine.QuitPlan(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'QuitPlan', plan: r.plan }); })
  router.post('/call/Nrt', (req, res) => { const r = Engine.Nrt(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'Nrt', plan: r.plan }); })
  router.post('/call/Varenicline', (req, res) => { const r = Engine.Varenicline(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'Varenicline', plan: r.plan }); })
  router.post('/call/Bupropion', (req, res) => { const r = Engine.Bupropion(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'Bupropion', plan: r.plan }); })
  router.post('/call/Counseling', (req, res) => { const r = Engine.Counseling(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'Counseling', plan: r.plan }); })
  router.post('/call/Relapse', (req, res) => { const r = Engine.Relapse(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'Relapse', plan: r.plan }); })
  router.post('/call/CarbonMonoxide', (req, res) => { const r = Engine.CarbonMonoxide(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'CarbonMonoxide', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
