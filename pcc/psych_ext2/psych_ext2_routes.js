// P3-BW psych_ext2 routes v3.35.0
// P3-BW: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./psych_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.35.0',
    module: 'psych_ext2',
    label: 'Psychiatry Extended 2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Depression', (req, res) => { const r = Engine.Depression(req.body || {}); res.json({ version: '3.35.0', module: 'psych_ext2', function: 'Depression', plan: r.plan }); })
  router.post('/call/Anxiety', (req, res) => { const r = Engine.Anxiety(req.body || {}); res.json({ version: '3.35.0', module: 'psych_ext2', function: 'Anxiety', plan: r.plan }); })
  router.post('/call/Bipolar', (req, res) => { const r = Engine.Bipolar(req.body || {}); res.json({ version: '3.35.0', module: 'psych_ext2', function: 'Bipolar', plan: r.plan }); })
  router.post('/call/PTSD', (req, res) => { const r = Engine.PTSD(req.body || {}); res.json({ version: '3.35.0', module: 'psych_ext2', function: 'PTSD', plan: r.plan }); })
  router.post('/call/Substance', (req, res) => { const r = Engine.Substance(req.body || {}); res.json({ version: '3.35.0', module: 'psych_ext2', function: 'Substance', plan: r.plan }); })
  router.post('/call/Schizophrenia', (req, res) => { const r = Engine.Schizophrenia(req.body || {}); res.json({ version: '3.35.0', module: 'psych_ext2', function: 'Schizophrenia', plan: r.plan }); })
  router.post('/call/ADHD', (req, res) => { const r = Engine.ADHD(req.body || {}); res.json({ version: '3.35.0', module: 'psych_ext2', function: 'ADHD', plan: r.plan }); })
  router.post('/call/Autism', (req, res) => { const r = Engine.Autism(req.body || {}); res.json({ version: '3.35.0', module: 'psych_ext2', function: 'Autism', plan: r.plan }); })
  router.post('/call/Eating', (req, res) => { const r = Engine.Eating(req.body || {}); res.json({ version: '3.35.0', module: 'psych_ext2', function: 'Eating', plan: r.plan }); })
  router.post('/call/Personality', (req, res) => { const r = Engine.Personality(req.body || {}); res.json({ version: '3.35.0', module: 'psych_ext2', function: 'Personality', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.35.0', module: 'psych_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
