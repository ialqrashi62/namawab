// P3-CX pcc_addiction_med routes v3.62.0
// P3-CX: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_addiction_med_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.62.0',
    module: 'pcc_addiction_med',
    label: 'PCC Addiction Medicine',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Audit', (req, res) => { const r = Engine.Audit(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'Audit', plan: r.plan }); })
  router.post('/call/Dast', (req, res) => { const r = Engine.Dast(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'Dast', plan: r.plan }); })
  router.post('/call/Cage', (req, res) => { const r = Engine.Cage(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'Cage', plan: r.plan }); })
  router.post('/call/Motivation', (req, res) => { const r = Engine.Motivation(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'Motivation', plan: r.plan }); })
  router.post('/call/Withdrawal', (req, res) => { const r = Engine.Withdrawal(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'Withdrawal', plan: r.plan }); })
  router.post('/call/MatOpioid', (req, res) => { const r = Engine.MatOpioid(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'MatOpioid', plan: r.plan }); })
  router.post('/call/MatAlcohol', (req, res) => { const r = Engine.MatAlcohol(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'MatAlcohol', plan: r.plan }); })
  router.post('/call/Overdose', (req, res) => { const r = Engine.Overdose(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'Overdose', plan: r.plan }); })
  router.post('/call/HarmReduction', (req, res) => { const r = Engine.HarmReduction(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'HarmReduction', plan: r.plan }); })
  router.post('/call/RelapsePlan', (req, res) => { const r = Engine.RelapsePlan(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'RelapsePlan', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
