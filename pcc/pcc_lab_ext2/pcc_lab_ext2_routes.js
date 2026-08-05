// P3-CI pcc_lab_ext2 routes v3.47.0
// P3-CI: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_lab_ext2';
const F = require('./pcc_lab_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.47.0',
    module: 'pcc_lab_ext2',
    label: 'PCC Lab Ext2',
    functions: Object.keys(F),
  });
});
  router.post('/call/Comprehensive', (req, res) => { const r = F.Comprehensive(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'Comprehensive', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Toxicology', (req, res) => { const r = F.Toxicology(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'Toxicology', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Molecular', (req, res) => { const r = F.Molecular(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'Molecular', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Banked', (req, res) => { const r = F.Banked(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'Banked', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Convenience', (req, res) => { const r = F.Convenience(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'Convenience', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Reference', (req, res) => { const r = F.Reference(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'Reference', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/PointOfCare', (req, res) => { const r = F.PointOfCare(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'PointOfCare', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Quality', (req, res) => { const r = F.Quality(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'Quality', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Turnaround', (req, res) => { const r = F.Turnaround(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'Turnaround', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Critical', (req, res) => { const r = F.Critical(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: 'Critical', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.47.0', module: 'pcc_lab_ext2', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
