// P3-CM pcc_rheum_ext4 routes v3.51.0
// P3-CM: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_rheum_ext4';
const F = require('./pcc_rheum_ext4_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.51.0',
    module: 'pcc_rheum_ext4',
    label: 'PCC Rheum Ext4',
    functions: Object.keys(F),
  });
});
  router.post('/call/Ra', (req, res) => { const r = F.Ra(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Ra', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Sle', (req, res) => { const r = F.Sle(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Sle', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Spa', (req, res) => { const r = F.Spa(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Spa', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Vasculitis', (req, res) => { const r = F.Vasculitis(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Vasculitis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Gout', (req, res) => { const r = F.Gout(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Gout', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Osteo', (req, res) => { const r = F.Osteo(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Osteo', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Sjogren', (req, res) => { const r = F.Sjogren(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Sjogren', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Scleroderma', (req, res) => { const r = F.Scleroderma(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Scleroderma', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Myositis', (req, res) => { const r = F.Myositis(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Myositis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Biologic', (req, res) => { const r = F.Biologic(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: 'Biologic', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.51.0', module: 'pcc_rheum_ext4', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
