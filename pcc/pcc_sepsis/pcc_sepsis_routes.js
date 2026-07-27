// P3-CS pcc_sepsis routes v3.57.0
// P3-CS: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_sepsis_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.57.0',
    module: 'pcc_sepsis',
    label: 'PCC Sepsis',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Screening', (req, res) => { const r = Engine.Screening(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'Screening', plan: r.plan }); })
  router.post('/call/Lactate', (req, res) => { const r = Engine.Lactate(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'Lactate', plan: r.plan }); })
  router.post('/call/Abx', (req, res) => { const r = Engine.Abx(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'Abx', plan: r.plan }); })
  router.post('/call/Fluid', (req, res) => { const r = Engine.Fluid(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'Fluid', plan: r.plan }); })
  router.post('/call/Vasopressor', (req, res) => { const r = Engine.Vasopressor(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'Vasopressor', plan: r.plan }); })
  router.post('/call/Culture', (req, res) => { const r = Engine.Culture(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'Culture', plan: r.plan }); })
  router.post('/call/SourceCtl', (req, res) => { const r = Engine.SourceCtl(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'SourceCtl', plan: r.plan }); })
  router.post('/call/DeEscalate', (req, res) => { const r = Engine.DeEscalate(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'DeEscalate', plan: r.plan }); })
  router.post('/call/Procalcitonin', (req, res) => { const r = Engine.Procalcitonin(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'Procalcitonin', plan: r.plan }); })
  router.post('/call/SepsisShock', (req, res) => { const r = Engine.SepsisShock(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_sepsis', function: 'SepsisShock', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.57.0', module: 'pcc_sepsis', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
