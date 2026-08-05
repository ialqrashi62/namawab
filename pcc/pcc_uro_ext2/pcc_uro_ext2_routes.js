// P3-CO pcc_uro_ext2 routes v3.53.0
// P3-CO: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_uro_ext2';
const F = require('./pcc_uro_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.53.0',
    module: 'pcc_uro_ext2',
    label: 'PCC Uro Ext2',
    functions: Object.keys(F),
  });
});
  router.post('/call/Bph', (req, res) => { const r = F.Bph(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Bph', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Pca', (req, res) => { const r = F.Pca(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Pca', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Renal', (req, res) => { const r = F.Renal(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Renal', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Stone', (req, res) => { const r = F.Stone(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Stone', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Bladder', (req, res) => { const r = F.Bladder(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Bladder', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Incontinence', (req, res) => { const r = F.Incontinence(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Incontinence', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Erectile', (req, res) => { const r = F.Erectile(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Erectile', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Urethritis', (req, res) => { const r = F.Urethritis(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Urethritis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Prostatitis', (req, res) => { const r = F.Prostatitis(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Prostatitis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Hematuria', (req, res) => { const r = F.Hematuria(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Hematuria', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
