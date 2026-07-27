// P3-BT icu_ext2 routes v3.32.0
// P3-BT: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./icu_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.32.0',
    module: 'icu_ext2',
    label: 'ICU Extended 2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Ventilator', (req, res) => { const r = Engine.Ventilator(req.body || {}); res.json({ version: '3.32.0', module: 'icu_ext2', function: 'Ventilator', plan: r.plan }); })
  router.post('/call/Sedation', (req, res) => { const r = Engine.Sedation(req.body || {}); res.json({ version: '3.32.0', module: 'icu_ext2', function: 'Sedation', plan: r.plan }); })
  router.post('/call/Shock', (req, res) => { const r = Engine.Shock(req.body || {}); res.json({ version: '3.32.0', module: 'icu_ext2', function: 'Shock', plan: r.plan }); })
  router.post('/call/DVT', (req, res) => { const r = Engine.DVT(req.body || {}); res.json({ version: '3.32.0', module: 'icu_ext2', function: 'DVT', plan: r.plan }); })
  router.post('/call/Glucose', (req, res) => { const r = Engine.Glucose(req.body || {}); res.json({ version: '3.32.0', module: 'icu_ext2', function: 'Glucose', plan: r.plan }); })
  router.post('/call/Electrolyte', (req, res) => { const r = Engine.Electrolyte(req.body || {}); res.json({ version: '3.32.0', module: 'icu_ext2', function: 'Electrolyte', plan: r.plan }); })
  router.post('/call/Transfusion', (req, res) => { const r = Engine.Transfusion(req.body || {}); res.json({ version: '3.32.0', module: 'icu_ext2', function: 'Transfusion', plan: r.plan }); })
  router.post('/call/CRRT', (req, res) => { const r = Engine.CRRT(req.body || {}); res.json({ version: '3.32.0', module: 'icu_ext2', function: 'CRRT', plan: r.plan }); })
  router.post('/call/ICP', (req, res) => { const r = Engine.ICP(req.body || {}); res.json({ version: '3.32.0', module: 'icu_ext2', function: 'ICP', plan: r.plan }); })
  router.post('/call/Nutrition', (req, res) => { const r = Engine.Nutrition(req.body || {}); res.json({ version: '3.32.0', module: 'icu_ext2', function: 'Nutrition', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.32.0', module: 'icu_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
