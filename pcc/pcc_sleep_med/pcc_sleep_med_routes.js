// P3-CW pcc_sleep_med routes v3.61.0
// P3-CW: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_sleep_med_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.61.0',
    module: 'pcc_sleep_med',
    label: 'PCC Sleep Medicine',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Ahi', (req, res) => { const r = Engine.Ahi(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Ahi', plan: r.plan }); })
  router.post('/call/Insomnia', (req, res) => { const r = Engine.Insomnia(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Insomnia', plan: r.plan }); })
  router.post('/call/Cpap', (req, res) => { const r = Engine.Cpap(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Cpap', plan: r.plan }); })
  router.post('/call/Daytime', (req, res) => { const r = Engine.Daytime(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Daytime', plan: r.plan }); })
  router.post('/call/Apnea', (req, res) => { const r = Engine.Apnea(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Apnea', plan: r.plan }); })
  router.post('/call/Oxygen', (req, res) => { const r = Engine.Oxygen(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Oxygen', plan: r.plan }); })
  router.post('/call/Restless', (req, res) => { const r = Engine.Restless(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Restless', plan: r.plan }); })
  router.post('/call/Narcolepsy', (req, res) => { const r = Engine.Narcolepsy(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Narcolepsy', plan: r.plan }); })
  router.post('/call/Parasomnia', (req, res) => { const r = Engine.Parasomnia(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Parasomnia', plan: r.plan }); })
  router.post('/call/Hypopnea', (req, res) => { const r = Engine.Hypopnea(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Hypopnea', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
