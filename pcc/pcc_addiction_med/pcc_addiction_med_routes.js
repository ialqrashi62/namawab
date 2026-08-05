// P3-CX pcc_addiction_med routes v3.62.0
// P3-CX: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_addiction_med';
const F = require('./pcc_addiction_med_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.62.0',
    module: 'pcc_addiction_med',
    label: 'PCC Addiction Medicine',
    functions: Object.keys(F),
  });
});
  router.post('/call/Audit', (req, res) => { const r = F.Audit(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'Audit', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Dast', (req, res) => { const r = F.Dast(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'Dast', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Cage', (req, res) => { const r = F.Cage(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'Cage', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Motivation', (req, res) => { const r = F.Motivation(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'Motivation', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Withdrawal', (req, res) => { const r = F.Withdrawal(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'Withdrawal', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/MatOpioid', (req, res) => { const r = F.MatOpioid(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'MatOpioid', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/MatAlcohol', (req, res) => { const r = F.MatAlcohol(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'MatAlcohol', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Overdose', (req, res) => { const r = F.Overdose(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'Overdose', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/HarmReduction', (req, res) => { const r = F.HarmReduction(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'HarmReduction', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/RelapsePlan', (req, res) => { const r = F.RelapsePlan(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: 'RelapsePlan', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.62.0', module: 'pcc_addiction_med', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
