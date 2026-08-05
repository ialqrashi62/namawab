// P3-CN pcc_id_ext3 routes v3.52.0
// P3-CN: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_id_ext3';
const F = require('./pcc_id_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.52.0',
    module: 'pcc_id_ext3',
    label: 'PCC ID Ext3',
    functions: Object.keys(F),
  });
});
  router.post('/call/Cdiff', (req, res) => { const r = F.Cdiff(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Cdiff', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Mrsa', (req, res) => { const r = F.Mrsa(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Mrsa', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Vre', (req, res) => { const r = F.Vre(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Vre', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Esbl', (req, res) => { const r = F.Esbl(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Esbl', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Tbflu', (req, res) => { const r = F.Tbflu(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Tbflu', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Malaria', (req, res) => { const r = F.Malaria(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Malaria', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Tb', (req, res) => { const r = F.Tb(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Tb', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Hiv', (req, res) => { const r = F.Hiv(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Hiv', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Hep', (req, res) => { const r = F.Hep(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Hep', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Travel', (req, res) => { const r = F.Travel(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Travel', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
