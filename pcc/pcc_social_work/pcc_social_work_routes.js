// P3-CQ pcc_social_work routes v3.55.0
// P3-CQ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_social_work_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.55.0',
    module: 'pcc_social_work',
    label: 'PCC Social Work',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Assessment', (req, res) => { const r = Engine.Assessment(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Assessment', plan: r.plan }); })
  router.post('/call/Placement', (req, res) => { const r = Engine.Placement(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Placement', plan: r.plan }); })
  router.post('/call/Psychosocial', (req, res) => { const r = Engine.Psychosocial(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Psychosocial', plan: r.plan }); })
  router.post('/call/Saf', (req, res) => { const r = Engine.Saf(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Saf', plan: r.plan }); })
  router.post('/call/Financial', (req, res) => { const r = Engine.Financial(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Financial', plan: r.plan }); })
  router.post('/call/Transport', (req, res) => { const r = Engine.Transport(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Transport', plan: r.plan }); })
  router.post('/call/Family', (req, res) => { const r = Engine.Family(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Family', plan: r.plan }); })
  router.post('/call/Abuse', (req, res) => { const r = Engine.Abuse(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Abuse', plan: r.plan }); })
  router.post('/call/Substance', (req, res) => { const r = Engine.Substance(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Substance', plan: r.plan }); })
  router.post('/call/Resources', (req, res) => { const r = Engine.Resources(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Resources', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.55.0', module: 'pcc_social_work', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
