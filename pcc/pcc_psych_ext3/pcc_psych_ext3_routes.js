// P3-CK pcc_psych_ext3 routes v3.49.0
// P3-CK: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_psych_ext3';
const F = require('./pcc_psych_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.49.0',
    module: 'pcc_psych_ext3',
    label: 'PCC Psych Ext3',
    functions: Object.keys(F),
  });
});
  router.post('/call/Screening', (req, res) => { const r = F.Screening(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'Screening', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Risk', (req, res) => { const r = F.Risk(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'Risk', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Depression', (req, res) => { const r = F.Depression(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'Depression', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Anxiety', (req, res) => { const r = F.Anxiety(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'Anxiety', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Substance', (req, res) => { const r = F.Substance(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'Substance', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Psychosis', (req, res) => { const r = F.Psychosis(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'Psychosis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Bipolar', (req, res) => { const r = F.Bipolar(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'Bipolar', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/MedMgmt', (req, res) => { const r = F.MedMgmt(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'MedMgmt', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Therapy', (req, res) => { const r = F.Therapy(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'Therapy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Restraint', (req, res) => { const r = F.Restraint(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'Restraint', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
