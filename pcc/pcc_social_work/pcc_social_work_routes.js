// P3-CQ pcc_social_work routes v3.55.0
// P3-CQ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_social_work';
const F = require('./pcc_social_work_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.55.0',
    module: 'pcc_social_work',
    label: 'PCC Social Work',
    functions: Object.keys(F),
  });
});
  router.post('/call/Assessment', (req, res) => { const r = F.Assessment(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Assessment', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Placement', (req, res) => { const r = F.Placement(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Placement', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Psychosocial', (req, res) => { const r = F.Psychosocial(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Psychosocial', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Saf', (req, res) => { const r = F.Saf(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Saf', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Financial', (req, res) => { const r = F.Financial(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Financial', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Transport', (req, res) => { const r = F.Transport(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Transport', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Family', (req, res) => { const r = F.Family(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Family', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Abuse', (req, res) => { const r = F.Abuse(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Abuse', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Substance', (req, res) => { const r = F.Substance(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Substance', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Resources', (req, res) => { const r = F.Resources(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_social_work', function: 'Resources', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.55.0', module: 'pcc_social_work', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
