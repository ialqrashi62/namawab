// P3-CO pcc_ophth_ext2 routes v3.53.0
// P3-CO: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_ophth_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.53.0',
    module: 'pcc_ophth_ext2',
    label: 'PCC Ophth Ext2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Visual', (req, res) => { const r = Engine.Visual(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Visual', plan: r.plan }); })
  router.post('/call/Cataract', (req, res) => { const r = Engine.Cataract(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Cataract', plan: r.plan }); })
  router.post('/call/Glaucoma', (req, res) => { const r = Engine.Glaucoma(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Glaucoma', plan: r.plan }); })
  router.post('/call/Retina', (req, res) => { const r = Engine.Retina(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Retina', plan: r.plan }); })
  router.post('/call/Uveitis', (req, res) => { const r = Engine.Uveitis(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Uveitis', plan: r.plan }); })
  router.post('/call/Conjunctivitis', (req, res) => { const r = Engine.Conjunctivitis(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Conjunctivitis', plan: r.plan }); })
  router.post('/call/Keratitis', (req, res) => { const r = Engine.Keratitis(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Keratitis', plan: r.plan }); })
  router.post('/call/Macular', (req, res) => { const r = Engine.Macular(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Macular', plan: r.plan }); })
  router.post('/call/Strab', (req, res) => { const r = Engine.Strab(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Strab', plan: r.plan }); })
  router.post('/call/Trauma', (req, res) => { const r = Engine.Trauma(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Trauma', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
