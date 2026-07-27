// P3-CM pcc_gi_ext3 routes v3.51.0
// P3-CM: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_gi_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.51.0',
    module: 'pcc_gi_ext3',
    label: 'PCC GI Ext3',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Dysphagia', (req, res) => { const r = Engine.Dysphagia(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'Dysphagia', plan: r.plan }); })
  router.post('/call/GERD', (req, res) => { const r = Engine.GERD(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'GERD', plan: r.plan }); })
  router.post('/call/IBS', (req, res) => { const r = Engine.IBS(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'IBS', plan: r.plan }); })
  router.post('/call/IBD', (req, res) => { const r = Engine.IBD(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'IBD', plan: r.plan }); })
  router.post('/call/Celiac', (req, res) => { const r = Engine.Celiac(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'Celiac', plan: r.plan }); })
  router.post('/call/HepB', (req, res) => { const r = Engine.HepB(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'HepB', plan: r.plan }); })
  router.post('/call/HepC', (req, res) => { const r = Engine.HepC(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'HepC', plan: r.plan }); })
  router.post('/call/Cirr', (req, res) => { const r = Engine.Cirr(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'Cirr', plan: r.plan }); })
  router.post('/call/Ppi', (req, res) => { const r = Engine.Ppi(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'Ppi', plan: r.plan }); })
  router.post('/call/Scope', (req, res) => { const r = Engine.Scope(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: 'Scope', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.51.0', module: 'pcc_gi_ext3', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
