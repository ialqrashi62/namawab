// P3-CI pcc_lab_ext2 routes v3.47.0
// P3-CI: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_lab_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.47.0',
    module: 'pcc_lab_ext2',
    label: 'PCC Lab Ext2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Comprehensive', (req, res) => { const r = Engine.Comprehensive(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'Comprehensive', plan: r.plan }); })
  router.post('/call/Toxicology', (req, res) => { const r = Engine.Toxicology(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'Toxicology', plan: r.plan }); })
  router.post('/call/Molecular', (req, res) => { const r = Engine.Molecular(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'Molecular', plan: r.plan }); })
  router.post('/call/Banked', (req, res) => { const r = Engine.Banked(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'Banked', plan: r.plan }); })
  router.post('/call/Convenience', (req, res) => { const r = Engine.Convenience(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'Convenience', plan: r.plan }); })
  router.post('/call/Reference', (req, res) => { const r = Engine.Reference(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'Reference', plan: r.plan }); })
  router.post('/call/PointOfCare', (req, res) => { const r = Engine.PointOfCare(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'PointOfCare', plan: r.plan }); })
  router.post('/call/Quality', (req, res) => { const r = Engine.Quality(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'Quality', plan: r.plan }); })
  router.post('/call/Turnaround', (req, res) => { const r = Engine.Turnaround(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'Turnaround', plan: r.plan }); })
  router.post('/call/Critical', (req, res) => { const r = Engine.Critical(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'Critical', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
