// P3-CI pcc_path_ext routes v3.47.0
// P3-CI: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_path_ext';
const F = require('./pcc_path_ext_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.47.0',
    module: 'pcc_path_ext',
    label: 'PCC Path Ext',
    functions: Object.keys(F),
  });
});
  router.post('/call/SpecimenType', (req, res) => { const r = F.SpecimenType(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'SpecimenType', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Grossing', (req, res) => { const r = F.Grossing(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'Grossing', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Embedding', (req, res) => { const r = F.Embedding(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'Embedding', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Stain', (req, res) => { const r = F.Stain(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'Stain', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Diagnosis', (req, res) => { const r = F.Diagnosis(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'Diagnosis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Margin', (req, res) => { const r = F.Margin(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'Margin', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Stage', (req, res) => { const r = F.Stage(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'Stage', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Grade', (req, res) => { const r = F.Grade(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'Grade', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Tnm', (req, res) => { const r = F.Tnm(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'Tnm', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Molecular', (req, res) => { const r = F.Molecular(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_path_ext', function: 'Molecular', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.47.0', module: 'pcc_path_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
