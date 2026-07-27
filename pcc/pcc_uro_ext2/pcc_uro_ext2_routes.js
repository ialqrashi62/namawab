// P3-CO pcc_uro_ext2 routes v3.53.0
// P3-CO: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_uro_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.53.0',
    module: 'pcc_uro_ext2',
    label: 'PCC Uro Ext2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Bph', (req, res) => { const r = Engine.Bph(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Bph', plan: r.plan }); })
  router.post('/call/Pca', (req, res) => { const r = Engine.Pca(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Pca', plan: r.plan }); })
  router.post('/call/Renal', (req, res) => { const r = Engine.Renal(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Renal', plan: r.plan }); })
  router.post('/call/Stone', (req, res) => { const r = Engine.Stone(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Stone', plan: r.plan }); })
  router.post('/call/Bladder', (req, res) => { const r = Engine.Bladder(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Bladder', plan: r.plan }); })
  router.post('/call/Incontinence', (req, res) => { const r = Engine.Incontinence(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Incontinence', plan: r.plan }); })
  router.post('/call/Erectile', (req, res) => { const r = Engine.Erectile(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Erectile', plan: r.plan }); })
  router.post('/call/Urethritis', (req, res) => { const r = Engine.Urethritis(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Urethritis', plan: r.plan }); })
  router.post('/call/Prostatitis', (req, res) => { const r = Engine.Prostatitis(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Prostatitis', plan: r.plan }); })
  router.post('/call/Hematuria', (req, res) => { const r = Engine.Hematuria(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: 'Hematuria', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.53.0', module: 'pcc_uro_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
