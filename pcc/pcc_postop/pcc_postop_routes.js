// P3-CH pcc_postop routes v3.46.0
// P3-CH: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_postop';
const F = require('./pcc_postop_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.46.0',
    module: 'pcc_postop',
    label: 'PCC Postop',
    functions: Object.keys(F),
  });
});
  router.post('/call/Pacu', (req, res) => { const r = F.Pacu(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'Pacu', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Pain', (req, res) => { const r = F.Pain(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'Pain', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Nausea', (req, res) => { const r = F.Nausea(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'Nausea', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Diet', (req, res) => { const r = F.Diet(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'Diet', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Activity', (req, res) => { const r = F.Activity(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'Activity', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Dvt', (req, res) => { const r = F.Dvt(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'Dvt', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Wound', (req, res) => { const r = F.Wound(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'Wound', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Drain', (req, res) => { const r = F.Drain(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'Drain', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Discharge', (req, res) => { const r = F.Discharge(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'Discharge', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/FollowUp', (req, res) => { const r = F.FollowUp(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_postop', function: 'FollowUp', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.46.0', module: 'pcc_postop', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
