// P3-BX cardio_ext3 routes v3.36.0
// P3-BX: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./cardio_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.36.0',
    module: 'cardio_ext3',
    label: 'Cardiology Extended 3',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/ACS', (req, res) => { const r = Engine.ACS(req.body || {}); res.json({ version: '3.36.0', module: 'cardio_ext3', function: 'ACS', plan: r.plan }); })
  router.post('/call/HF', (req, res) => { const r = Engine.HF(req.body || {}); res.json({ version: '3.36.0', module: 'cardio_ext3', function: 'HF', plan: r.plan }); })
  router.post('/call/AF', (req, res) => { const r = Engine.AF(req.body || {}); res.json({ version: '3.36.0', module: 'cardio_ext3', function: 'AF', plan: r.plan }); })
  router.post('/call/Valve', (req, res) => { const r = Engine.Valve(req.body || {}); res.json({ version: '3.36.0', module: 'cardio_ext3', function: 'Valve', plan: r.plan }); })
  router.post('/call/HTN', (req, res) => { const r = Engine.HTN(req.body || {}); res.json({ version: '3.36.0', module: 'cardio_ext3', function: 'HTN', plan: r.plan }); })
  router.post('/call/Lipid', (req, res) => { const r = Engine.Lipid(req.body || {}); res.json({ version: '3.36.0', module: 'cardio_ext3', function: 'Lipid', plan: r.plan }); })
  router.post('/call/Anticoag', (req, res) => { const r = Engine.Anticoag(req.body || {}); res.json({ version: '3.36.0', module: 'cardio_ext3', function: 'Anticoag', plan: r.plan }); })
  router.post('/call/EP', (req, res) => { const r = Engine.EP(req.body || {}); res.json({ version: '3.36.0', module: 'cardio_ext3', function: 'EP', plan: r.plan }); })
  router.post('/call/Pericardial', (req, res) => { const r = Engine.Pericardial(req.body || {}); res.json({ version: '3.36.0', module: 'cardio_ext3', function: 'Pericardial', plan: r.plan }); })
  router.post('/call/PAD', (req, res) => { const r = Engine.PAD(req.body || {}); res.json({ version: '3.36.0', module: 'cardio_ext3', function: 'PAD', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.36.0', module: 'cardio_ext3', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
