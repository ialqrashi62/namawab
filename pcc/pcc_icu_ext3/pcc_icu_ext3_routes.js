// P3-CJ pcc_icu_ext3 routes v3.48.0
// P3-CJ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_icu_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.48.0',
    module: 'pcc_icu_ext3',
    label: 'PCC ICU Ext3',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Ventilation', (req, res) => { const r = Engine.Ventilation(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'Ventilation', plan: r.plan }); })
  router.post('/call/Sedation', (req, res) => { const r = Engine.Sedation(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'Sedation', plan: r.plan }); })
  router.post('/call/Drivers', (req, res) => { const r = Engine.Drivers(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'Drivers', plan: r.plan }); })
  router.post('/call/Nutrition', (req, res) => { const r = Engine.Nutrition(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'Nutrition', plan: r.plan }); })
  router.post('/call/Transport', (req, res) => { const r = Engine.Transport(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'Transport', plan: r.plan }); })
  router.post('/call/Braden', (req, res) => { const r = Engine.Braden(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'Braden', plan: r.plan }); })
  router.post('/call/HandHygiene', (req, res) => { const r = Engine.HandHygiene(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'HandHygiene', plan: r.plan }); })
  router.post('/call/Discharge', (req, res) => { const r = Engine.Discharge(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'Discharge', plan: r.plan }); })
  router.post('/call/DailyGoals', (req, res) => { const r = Engine.DailyGoals(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'DailyGoals', plan: r.plan }); })
  router.post('/call/Requiring', (req, res) => { const r = Engine.Requiring(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'Requiring', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
