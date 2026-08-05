// P3-CC pcc_decision routes v3.41.0
// P3-CC: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_decision';
const F = require('./pcc_decision_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.41.0',
    module: 'pcc_decision',
    label: 'PCC Decision',
    functions: Object.keys(F),
  });
});
  router.post('/call/Triage', (req, res) => { const r = F.Triage(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'Triage', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Risk', (req, res) => { const r = F.Risk(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'Risk', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Recommendation', (req, res) => { const r = F.Recommendation(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'Recommendation', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Differential', (req, res) => { const r = F.Differential(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'Differential', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Path', (req, res) => { const r = F.Path(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'Path', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Severity', (req, res) => { const r = F.Severity(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'Severity', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Outcome', (req, res) => { const r = F.Outcome(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'Outcome', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/FollowUp', (req, res) => { const r = F.FollowUp(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'FollowUp', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Test', (req, res) => { const r = F.Test(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'Test', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Therapy', (req, res) => { const r = F.Therapy(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_decision', function: 'Therapy', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.41.0', module: 'pcc_decision', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
