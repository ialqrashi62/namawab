// P3-CE pcc_education routes v3.43.0
// P3-CE: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_education_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.43.0',
    module: 'pcc_education',
    label: 'PCC Education',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Curriculum', (req, res) => { const r = Engine.Curriculum(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'Curriculum', plan: r.plan }); })
  router.post('/call/Rotation', (req, res) => { const r = Engine.Rotation(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'Rotation', plan: r.plan }); })
  router.post('/call/Simulation', (req, res) => { const r = Engine.Simulation(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'Simulation', plan: r.plan }); })
  router.post('/call/Eval', (req, res) => { const r = Engine.Eval(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'Eval', plan: r.plan }); })
  router.post('/call/Lecture', (req, res) => { const r = Engine.Lecture(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'Lecture', plan: r.plan }); })
  router.post('/call/Bedside', (req, res) => { const r = Engine.Bedside(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'Bedside', plan: r.plan }); })
  router.post('/call/Cert', (req, res) => { const r = Engine.Cert(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'Cert', plan: r.plan }); })
  router.post('/call/Fellow', (req, res) => { const r = Engine.Fellow(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'Fellow', plan: r.plan }); })
  router.post('/call/CEU', (req, res) => { const r = Engine.CEU(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'CEU', plan: r.plan }); })
  router.post('/call/Exam', (req, res) => { const r = Engine.Exam(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'Exam', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.43.0', module: 'pcc_education', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
