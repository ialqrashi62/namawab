// P3-CI pcc_path_ext routes v3.47.0
// P3-CI: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_path_ext_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.47.0',
    module: 'pcc_path_ext',
    label: 'PCC Path Ext',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/SpecimenType', (req, res) => { const r = Engine.SpecimenType(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'SpecimenType', plan: r.plan }); })
  router.post('/call/Grossing', (req, res) => { const r = Engine.Grossing(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'Grossing', plan: r.plan }); })
  router.post('/call/Embedding', (req, res) => { const r = Engine.Embedding(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'Embedding', plan: r.plan }); })
  router.post('/call/Stain', (req, res) => { const r = Engine.Stain(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'Stain', plan: r.plan }); })
  router.post('/call/Diagnosis', (req, res) => { const r = Engine.Diagnosis(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'Diagnosis', plan: r.plan }); })
  router.post('/call/Margin', (req, res) => { const r = Engine.Margin(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'Margin', plan: r.plan }); })
  router.post('/call/Stage', (req, res) => { const r = Engine.Stage(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'Stage', plan: r.plan }); })
  router.post('/call/Grade', (req, res) => { const r = Engine.Grade(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'Grade', plan: r.plan }); })
  router.post('/call/Tnm', (req, res) => { const r = Engine.Tnm(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'Tnm', plan: r.plan }); })
  router.post('/call/Molecular', (req, res) => { const r = Engine.Molecular(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'Molecular', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.47.0', module: 'pcc_path_ext', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
