// P3-CF pcc_telemed routes v3.44.0
// P3-CF: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_telemed';
const F = require('./pcc_telemed_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.44.0',
    module: 'pcc_telemed',
    label: 'PCC Telemed',
    functions: Object.keys(F),
  });
});
  router.post('/call/Visit', (req, res) => { const r = F.Visit(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'Visit', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Consent', (req, res) => { const r = F.Consent(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'Consent', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Connection', (req, res) => { const r = F.Connection(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'Connection', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Prescribe', (req, res) => { const r = F.Prescribe(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'Prescribe', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Charting', (req, res) => { const r = F.Charting(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'Charting', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Triage', (req, res) => { const r = F.Triage(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'Triage', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Reimburse', (req, res) => { const r = F.Reimburse(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'Reimburse', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Platform', (req, res) => { const r = F.Platform(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'Platform', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/FollowUp', (req, res) => { const r = F.FollowUp(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'FollowUp', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Audit', (req, res) => { const r = F.Audit(req.body || {}); res.json({ version: '3.44.0', module: 'pcc_telemed', function: 'Audit', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.44.0', module: 'pcc_telemed', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
