// P3-BX endo_ext2 routes v3.36.0
// P3-BX: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./endo_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.36.0',
    module: 'endo_ext2',
    label: 'Endocrinology Extended 2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Diabetes', (req, res) => { const r = Engine.Diabetes(req.body || {}); res.json({ version: '3.36.0', module: 'endo_ext2', function: 'Diabetes', plan: r.plan }); })
  router.post('/call/Thyroid', (req, res) => { const r = Engine.Thyroid(req.body || {}); res.json({ version: '3.36.0', module: 'endo_ext2', function: 'Thyroid', plan: r.plan }); })
  router.post('/call/Adrenal', (req, res) => { const r = Engine.Adrenal(req.body || {}); res.json({ version: '3.36.0', module: 'endo_ext2', function: 'Adrenal', plan: r.plan }); })
  router.post('/call/Pituitary', (req, res) => { const r = Engine.Pituitary(req.body || {}); res.json({ version: '3.36.0', module: 'endo_ext2', function: 'Pituitary', plan: r.plan }); })
  router.post('/call/Calcium', (req, res) => { const r = Engine.Calcium(req.body || {}); res.json({ version: '3.36.0', module: 'endo_ext2', function: 'Calcium', plan: r.plan }); })
  router.post('/call/Bone', (req, res) => { const r = Engine.Bone(req.body || {}); res.json({ version: '3.36.0', module: 'endo_ext2', function: 'Bone', plan: r.plan }); })
  router.post('/call/AdrenalMass', (req, res) => { const r = Engine.AdrenalMass(req.body || {}); res.json({ version: '3.36.0', module: 'endo_ext2', function: 'AdrenalMass', plan: r.plan }); })
  router.post('/call/Obesity', (req, res) => { const r = Engine.Obesity(req.body || {}); res.json({ version: '3.36.0', module: 'endo_ext2', function: 'Obesity', plan: r.plan }); })
  router.post('/call/Lipid', (req, res) => { const r = Engine.Lipid(req.body || {}); res.json({ version: '3.36.0', module: 'endo_ext2', function: 'Lipid', plan: r.plan }); })
  router.post('/call/ReproEndo', (req, res) => { const r = Engine.ReproEndo(req.body || {}); res.json({ version: '3.36.0', module: 'endo_ext2', function: 'ReproEndo', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.36.0', module: 'endo_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
