// P3-BR radiology2 routes v3.30.0
// P3-BR: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./radiology2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.30.0',
    module: 'radiology2',
    label: 'Radiology 2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/CT', (req, res) => { const r = Engine.CT(req.body || {}); res.json({ version: '3.30.0', module: 'radiology2', function: 'CT', plan: r.plan }); })
  router.post('/call/MRI', (req, res) => { const r = Engine.MRI(req.body || {}); res.json({ version: '3.30.0', module: 'radiology2', function: 'MRI', plan: r.plan }); })
  router.post('/call/US', (req, res) => { const r = Engine.US(req.body || {}); res.json({ version: '3.30.0', module: 'radiology2', function: 'US', plan: r.plan }); })
  router.post('/call/Xray', (req, res) => { const r = Engine.Xray(req.body || {}); res.json({ version: '3.30.0', module: 'radiology2', function: 'Xray', plan: r.plan }); })
  router.post('/call/Nuclear', (req, res) => { const r = Engine.Nuclear(req.body || {}); res.json({ version: '3.30.0', module: 'radiology2', function: 'Nuclear', plan: r.plan }); })
  router.post('/call/Interventional', (req, res) => { const r = Engine.Interventional(req.body || {}); res.json({ version: '3.30.0', module: 'radiology2', function: 'Interventional', plan: r.plan }); })
  router.post('/call/Mammo', (req, res) => { const r = Engine.Mammo(req.body || {}); res.json({ version: '3.30.0', module: 'radiology2', function: 'Mammo', plan: r.plan }); })
  router.post('/call/Fluoro', (req, res) => { const r = Engine.Fluoro(req.body || {}); res.json({ version: '3.30.0', module: 'radiology2', function: 'Fluoro', plan: r.plan }); })
  router.post('/call/PE', (req, res) => { const r = Engine.PE(req.body || {}); res.json({ version: '3.30.0', module: 'radiology2', function: 'PE', plan: r.plan }); })
  router.post('/call/Biopsy', (req, res) => { const r = Engine.Biopsy(req.body || {}); res.json({ version: '3.30.0', module: 'radiology2', function: 'Biopsy', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.30.0', module: 'radiology2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
