// P3-CS pcc_sepsis routes v3.57.0
// P3-CS: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_sepsis';
const F = require('./pcc_sepsis_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.57.0',
    module: 'pcc_sepsis',
    label: 'PCC Sepsis',
    functions: Object.keys(F),
  });
});
  router.post('/call/Screening', (req, res) => { const r = F.Screening(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'Screening', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Lactate', (req, res) => { const r = F.Lactate(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'Lactate', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Abx', (req, res) => { const r = F.Abx(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'Abx', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Fluid', (req, res) => { const r = F.Fluid(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'Fluid', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Vasopressor', (req, res) => { const r = F.Vasopressor(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'Vasopressor', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Culture', (req, res) => { const r = F.Culture(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'Culture', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/SourceCtl', (req, res) => { const r = F.SourceCtl(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'SourceCtl', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/DeEscalate', (req, res) => { const r = F.DeEscalate(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'DeEscalate', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Procalcitonin', (req, res) => { const r = F.Procalcitonin(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'Procalcitonin', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/SepsisShock', (req, res) => { const r = F.SepsisShock(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'SepsisShock', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.57.0', module: 'pcc_sepsis', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
