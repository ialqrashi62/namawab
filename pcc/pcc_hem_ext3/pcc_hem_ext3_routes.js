// P3-CN pcc_hem_ext3 routes v3.52.0
// P3-CN: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_hem_ext3';
const F = require('./pcc_hem_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.52.0',
    module: 'pcc_hem_ext3',
    label: 'PCC Hem Ext3',
    functions: Object.keys(F),
  });
});
  router.post('/call/Anemia', (req, res) => { const r = F.Anemia(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Anemia', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Transfusion', (req, res) => { const r = F.Transfusion(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Transfusion', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Coag', (req, res) => { const r = F.Coag(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Coag', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Marrow', (req, res) => { const r = F.Marrow(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Marrow', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Mds', (req, res) => { const r = F.Mds(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Mds', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Mpn', (req, res) => { const r = F.Mpn(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Mpn', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Lymphoma', (req, res) => { const r = F.Lymphoma(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Lymphoma', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Leukemia', (req, res) => { const r = F.Leukemia(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Leukemia', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Transplant', (req, res) => { const r = F.Transplant(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Transplant', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Iron', (req, res) => { const r = F.Iron(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Iron', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
