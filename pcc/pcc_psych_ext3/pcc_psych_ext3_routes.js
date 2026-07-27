// P3-CK pcc_psych_ext3 routes v3.49.0
// P3-CK: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_psych_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.49.0',
    module: 'pcc_psych_ext3',
    label: 'PCC Psych Ext3',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Screening', (req, res) => { const r = Engine.Screening(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'Screening', plan: r.plan }); })
  router.post('/call/Risk', (req, res) => { const r = Engine.Risk(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'Risk', plan: r.plan }); })
  router.post('/call/Depression', (req, res) => { const r = Engine.Depression(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'Depression', plan: r.plan }); })
  router.post('/call/Anxiety', (req, res) => { const r = Engine.Anxiety(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'Anxiety', plan: r.plan }); })
  router.post('/call/Substance', (req, res) => { const r = Engine.Substance(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'Substance', plan: r.plan }); })
  router.post('/call/Psychosis', (req, res) => { const r = Engine.Psychosis(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'Psychosis', plan: r.plan }); })
  router.post('/call/Bipolar', (req, res) => { const r = Engine.Bipolar(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'Bipolar', plan: r.plan }); })
  router.post('/call/MedMgmt', (req, res) => { const r = Engine.MedMgmt(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'MedMgmt', plan: r.plan }); })
  router.post('/call/Therapy', (req, res) => { const r = Engine.Therapy(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'Therapy', plan: r.plan }); })
  router.post('/call/Restraint', (req, res) => { const r = Engine.Restraint(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: 'Restraint', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.49.0', module: 'pcc_psych_ext3', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
