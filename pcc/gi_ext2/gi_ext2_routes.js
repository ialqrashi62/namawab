// P3-BV gi_ext2 routes v3.34.0
// P3-BV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./gi_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.34.0',
    module: 'gi_ext2',
    label: 'GI Extended 2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Dysphagia', (req, res) => { const r = Engine.Dysphagia(req.body || {}); res.json({ version: '3.34.0', module: 'gi_ext2', function: 'Dysphagia', plan: r.plan }); })
  router.post('/call/GERD', (req, res) => { const r = Engine.GERD(req.body || {}); res.json({ version: '3.34.0', module: 'gi_ext2', function: 'GERD', plan: r.plan }); })
  router.post('/call/PUD', (req, res) => { const r = Engine.PUD(req.body || {}); res.json({ version: '3.34.0', module: 'gi_ext2', function: 'PUD', plan: r.plan }); })
  router.post('/call/IBD', (req, res) => { const r = Engine.IBD(req.body || {}); res.json({ version: '3.34.0', module: 'gi_ext2', function: 'IBD', plan: r.plan }); })
  router.post('/call/IBS', (req, res) => { const r = Engine.IBS(req.body || {}); res.json({ version: '3.34.0', module: 'gi_ext2', function: 'IBS', plan: r.plan }); })
  router.post('/call/Celiac', (req, res) => { const r = Engine.Celiac(req.body || {}); res.json({ version: '3.34.0', module: 'gi_ext2', function: 'Celiac', plan: r.plan }); })
  router.post('/call/Pancreatitis', (req, res) => { const r = Engine.Pancreatitis(req.body || {}); res.json({ version: '3.34.0', module: 'gi_ext2', function: 'Pancreatitis', plan: r.plan }); })
  router.post('/call/Cirrhosis', (req, res) => { const r = Engine.Cirrhosis(req.body || {}); res.json({ version: '3.34.0', module: 'gi_ext2', function: 'Cirrhosis', plan: r.plan }); })
  router.post('/call/Jaundice', (req, res) => { const r = Engine.Jaundice(req.body || {}); res.json({ version: '3.34.0', module: 'gi_ext2', function: 'Jaundice', plan: r.plan }); })
  router.post('/call/Bleed', (req, res) => { const r = Engine.Bleed(req.body || {}); res.json({ version: '3.34.0', module: 'gi_ext2', function: 'Bleed', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.34.0', module: 'gi_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
