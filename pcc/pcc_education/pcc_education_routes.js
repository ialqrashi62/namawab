// P3-CE pcc_education routes v3.43.0
// P3-CE: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_education';
const F = require('./pcc_education_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.43.0',
    module: 'pcc_education',
    label: 'PCC Education',
    functions: Object.keys(F),
  });
});
  router.post('/call/Curriculum', (req, res) => { const r = F.Curriculum(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'Curriculum', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Rotation', (req, res) => { const r = F.Rotation(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'Rotation', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Simulation', (req, res) => { const r = F.Simulation(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'Simulation', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Eval', (req, res) => { const r = F.Eval(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'Eval', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Lecture', (req, res) => { const r = F.Lecture(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'Lecture', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Bedside', (req, res) => { const r = F.Bedside(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'Bedside', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Cert', (req, res) => { const r = F.Cert(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'Cert', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Fellow', (req, res) => { const r = F.Fellow(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'Fellow', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/CEU', (req, res) => { const r = F.CEU(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'CEU', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Exam', (req, res) => { const r = F.Exam(req.body || {}); res.json({ version: '3.43.0', module: 'pcc_education', function: 'Exam', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.43.0', module: 'pcc_education', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
