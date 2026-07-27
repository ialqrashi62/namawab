// P3-BV derma_ext2 routes v3.34.0
// P3-BV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./derma_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.34.0',
    module: 'derma_ext2',
    label: 'Dermatology Extended 2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Eczema', (req, res) => { const r = Engine.Eczema(req.body || {}); res.json({ version: '3.34.0', module: 'derma_ext2', function: 'Eczema', plan: r.plan }); })
  router.post('/call/Psoriasis', (req, res) => { const r = Engine.Psoriasis(req.body || {}); res.json({ version: '3.34.0', module: 'derma_ext2', function: 'Psoriasis', plan: r.plan }); })
  router.post('/call/Acne', (req, res) => { const r = Engine.Acne(req.body || {}); res.json({ version: '3.34.0', module: 'derma_ext2', function: 'Acne', plan: r.plan }); })
  router.post('/call/Melanoma', (req, res) => { const r = Engine.Melanoma(req.body || {}); res.json({ version: '3.34.0', module: 'derma_ext2', function: 'Melanoma', plan: r.plan }); })
  router.post('/call/BCC', (req, res) => { const r = Engine.BCC(req.body || {}); res.json({ version: '3.34.0', module: 'derma_ext2', function: 'BCC', plan: r.plan }); })
  router.post('/call/Rash', (req, res) => { const r = Engine.Rash(req.body || {}); res.json({ version: '3.34.0', module: 'derma_ext2', function: 'Rash', plan: r.plan }); })
  router.post('/call/Urticaria', (req, res) => { const r = Engine.Urticaria(req.body || {}); res.json({ version: '3.34.0', module: 'derma_ext2', function: 'Urticaria', plan: r.plan }); })
  router.post('/call/Autoimmune', (req, res) => { const r = Engine.Autoimmune(req.body || {}); res.json({ version: '3.34.0', module: 'derma_ext2', function: 'Autoimmune', plan: r.plan }); })
  router.post('/call/Infxn', (req, res) => { const r = Engine.Infxn(req.body || {}); res.json({ version: '3.34.0', module: 'derma_ext2', function: 'Infxn', plan: r.plan }); })
  router.post('/call/Burns', (req, res) => { const r = Engine.Burns(req.body || {}); res.json({ version: '3.34.0', module: 'derma_ext2', function: 'Burns', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.34.0', module: 'derma_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
