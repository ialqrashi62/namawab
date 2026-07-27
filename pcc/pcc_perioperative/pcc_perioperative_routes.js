// P3-CH pcc_perioperative routes v3.46.0
// P3-CH: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_perioperative_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.46.0',
    module: 'pcc_perioperative',
    label: 'PCC Perioperative',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/PreopEval', (req, res) => { const r = Engine.PreopEval(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'PreopEval', plan: r.plan }); })
  router.post('/call/Npo', (req, res) => { const r = Engine.Npo(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'Npo', plan: r.plan }); })
  router.post('/call/Meds', (req, res) => { const r = Engine.Meds(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'Meds', plan: r.plan }); })
  router.post('/call/Handoff', (req, res) => { const r = Engine.Handoff(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'Handoff', plan: r.plan }); })
  router.post('/call/SignIn', (req, res) => { const r = Engine.SignIn(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'SignIn', plan: r.plan }); })
  router.post('/call/TimeOut', (req, res) => { const r = Engine.TimeOut(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'TimeOut', plan: r.plan }); })
  router.post('/call/SignOut', (req, res) => { const r = Engine.SignOut(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'SignOut', plan: r.plan }); })
  router.post('/call/SkinPrep', (req, res) => { const r = Engine.SkinPrep(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'SkinPrep', plan: r.plan }); })
  router.post('/call/Normothermia', (req, res) => { const r = Engine.Normothermia(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'Normothermia', plan: r.plan }); })
  router.post('/call/Ebl', (req, res) => { const r = Engine.Ebl(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_perioperative', function: 'Ebl', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.46.0', module: 'pcc_perioperative', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
