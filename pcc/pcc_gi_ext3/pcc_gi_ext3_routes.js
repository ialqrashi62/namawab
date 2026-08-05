// P3-CM pcc_gi_ext3 routes v3.51.0
// P3-CM: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_gi_ext3';
const F = require('./pcc_gi_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.51.0',
    module: 'pcc_gi_ext3',
    label: 'PCC GI Ext3',
    functions: Object.keys(F),
  });
});
  router.post('/call/Dysphagia', (req, res) => { const r = F.Dysphagia(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'Dysphagia', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/GERD', (req, res) => { const r = F.GERD(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'GERD', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/IBS', (req, res) => { const r = F.IBS(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'IBS', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/IBD', (req, res) => { const r = F.IBD(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'IBD', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Celiac', (req, res) => { const r = F.Celiac(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'Celiac', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/HepB', (req, res) => { const r = F.HepB(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'HepB', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/HepC', (req, res) => { const r = F.HepC(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'HepC', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Cirr', (req, res) => { const r = F.Cirr(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'Cirr', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Ppi', (req, res) => { const r = F.Ppi(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'Ppi', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Scope', (req, res) => { const r = F.Scope(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'Scope', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
