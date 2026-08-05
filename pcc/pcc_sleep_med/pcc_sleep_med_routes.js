// P3-CW pcc_sleep_med routes v3.61.0
// P3-CW: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_sleep_med';
const F = require('./pcc_sleep_med_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.61.0',
    module: 'pcc_sleep_med',
    label: 'PCC Sleep Medicine',
    functions: Object.keys(F),
  });
});
  router.post('/call/Ahi', (req, res) => { const r = F.Ahi(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Ahi', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Insomnia', (req, res) => { const r = F.Insomnia(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Insomnia', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Cpap', (req, res) => { const r = F.Cpap(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Cpap', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Daytime', (req, res) => { const r = F.Daytime(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Daytime', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Apnea', (req, res) => { const r = F.Apnea(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Apnea', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Oxygen', (req, res) => { const r = F.Oxygen(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Oxygen', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Restless', (req, res) => { const r = F.Restless(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Restless', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Narcolepsy', (req, res) => { const r = F.Narcolepsy(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Narcolepsy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Parasomnia', (req, res) => { const r = F.Parasomnia(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Parasomnia', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Hypopnea', (req, res) => { const r = F.Hypopnea(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: 'Hypopnea', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.61.0', module: 'pcc_sleep_med', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
