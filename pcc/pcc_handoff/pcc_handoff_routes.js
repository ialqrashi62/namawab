// P3-CR pcc_handoff routes v3.56.0
// P3-CR: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_handoff';
const F = require('./pcc_handoff_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.56.0',
    module: 'pcc_handoff',
    label: 'PCC Handoff',
    functions: Object.keys(F),
  });
});
  router.post('/call/Ipass', (req, res) => { const r = F.Ipass(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Ipass', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Sbar', (req, res) => { const r = F.Sbar(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Sbar', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Shift', (req, res) => { const r = F.Shift(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Shift', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Discharge', (req, res) => { const r = F.Discharge(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Discharge', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Icu', (req, res) => { const r = F.Icu(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Icu', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Or', (req, res) => { const r = F.Or(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Or', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Er', (req, res) => { const r = F.Er(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Er', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Anesthesia', (req, res) => { const r = F.Anesthesia(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Anesthesia', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Primary', (req, res) => { const r = F.Primary(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Primary', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Receiving', (req, res) => { const r = F.Receiving(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_handoff', function: 'Receiving', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.56.0', module: 'pcc_handoff', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
