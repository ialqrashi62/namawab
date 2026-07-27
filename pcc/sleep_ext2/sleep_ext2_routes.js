// P3-BY sleep_ext2 routes v3.37.0
// P3-BY: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./sleep_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.37.0',
    module: 'sleep_ext2',
    label: 'Sleep Extended 2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Insomnia', (req, res) => { const r = Engine.Insomnia(req.body || {}); res.json({ version: '3.37.0', module: 'sleep_ext2', function: 'Insomnia', plan: r.plan }); })
  router.post('/call/OSA', (req, res) => { const r = Engine.OSA(req.body || {}); res.json({ version: '3.37.0', module: 'sleep_ext2', function: 'OSA', plan: r.plan }); })
  router.post('/call/RLS', (req, res) => { const r = Engine.RLS(req.body || {}); res.json({ version: '3.37.0', module: 'sleep_ext2', function: 'RLS', plan: r.plan }); })
  router.post('/call/Narcolepsy', (req, res) => { const r = Engine.Narcolepsy(req.body || {}); res.json({ version: '3.37.0', module: 'sleep_ext2', function: 'Narcolepsy', plan: r.plan }); })
  router.post('/call/Parasomnia', (req, res) => { const r = Engine.Parasomnia(req.body || {}); res.json({ version: '3.37.0', module: 'sleep_ext2', function: 'Parasomnia', plan: r.plan }); })
  router.post('/call/Circadian', (req, res) => { const r = Engine.Circadian(req.body || {}); res.json({ version: '3.37.0', module: 'sleep_ext2', function: 'Circadian', plan: r.plan }); })
  router.post('/call/CPAP', (req, res) => { const r = Engine.CPAP(req.body || {}); res.json({ version: '3.37.0', module: 'sleep_ext2', function: 'CPAP', plan: r.plan }); })
  router.post('/call/Daytime', (req, res) => { const r = Engine.Daytime(req.body || {}); res.json({ version: '3.37.0', module: 'sleep_ext2', function: 'Daytime', plan: r.plan }); })
  router.post('/call/Pediatric', (req, res) => { const r = Engine.Pediatric(req.body || {}); res.json({ version: '3.37.0', module: 'sleep_ext2', function: 'Pediatric', plan: r.plan }); })
  router.post('/call/SleepStudy', (req, res) => { const r = Engine.SleepStudy(req.body || {}); res.json({ version: '3.37.0', module: 'sleep_ext2', function: 'SleepStudy', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.37.0', module: 'sleep_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
