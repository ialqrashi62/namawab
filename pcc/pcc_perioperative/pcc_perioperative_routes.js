// P3-CH pcc_perioperative routes v3.46.0
// P3-CH: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_perioperative';
const F = require('./pcc_perioperative_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.46.0',
    module: 'pcc_perioperative',
    label: 'PCC Perioperative',
    functions: Object.keys(F),
  });
});
  router.post('/call/PreopEval', (req, res) => { const r = F.PreopEval(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'PreopEval', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Npo', (req, res) => { const r = F.Npo(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'Npo', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Meds', (req, res) => { const r = F.Meds(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'Meds', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Handoff', (req, res) => { const r = F.Handoff(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'Handoff', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/SignIn', (req, res) => { const r = F.SignIn(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'SignIn', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/TimeOut', (req, res) => { const r = F.TimeOut(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'TimeOut', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/SignOut', (req, res) => { const r = F.SignOut(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'SignOut', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/SkinPrep', (req, res) => { const r = F.SkinPrep(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'SkinPrep', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Normothermia', (req, res) => { const r = F.Normothermia(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'Normothermia', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Ebl', (req, res) => { const r = F.Ebl(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'Ebl', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.46.0', module: 'pcc_perioperative', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
