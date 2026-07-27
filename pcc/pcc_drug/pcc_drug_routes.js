// P3-CC pcc_drug routes v3.41.0
// P3-CC: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_drug_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.41.0',
    module: 'pcc_drug',
    label: 'PCC Drug',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Dose', (req, res) => { const r = Engine.Dose(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Dose', plan: r.plan }); })
  router.post('/call/Interaction', (req, res) => { const r = Engine.Interaction(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Interaction', plan: r.plan }); })
  router.post('/call/Allergy', (req, res) => { const r = Engine.Allergy(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Allergy', plan: r.plan }); })
  router.post('/call/Renal', (req, res) => { const r = Engine.Renal(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Renal', plan: r.plan }); })
  router.post('/call/Hepatic', (req, res) => { const r = Engine.Hepatic(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Hepatic', plan: r.plan }); })
  router.post('/call/Level', (req, res) => { const r = Engine.Level(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Level', plan: r.plan }); })
  router.post('/call/Pregnancy', (req, res) => { const r = Engine.Pregnancy(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Pregnancy', plan: r.plan }); })
  router.post('/call/Route', (req, res) => { const r = Engine.Route(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Route', plan: r.plan }); })
  router.post('/call/Frequency', (req, res) => { const r = Engine.Frequency(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Frequency', plan: r.plan }); })
  router.post('/call/Duration', (req, res) => { const r = Engine.Duration(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Duration', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.41.0', module: 'pcc_drug', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
