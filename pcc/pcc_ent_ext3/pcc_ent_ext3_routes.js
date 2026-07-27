// P3-CO pcc_ent_ext3 routes v3.53.0
// P3-CO: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_ent_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.53.0',
    module: 'pcc_ent_ext3',
    label: 'PCC ENT Ext3',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Hearing', (req, res) => { const r = Engine.Hearing(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Hearing', plan: r.plan }); })
  router.post('/call/Ottis', (req, res) => { const r = Engine.Ottis(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Ottis', plan: r.plan }); })
  router.post('/call/Sinusitis', (req, res) => { const r = Engine.Sinusitis(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Sinusitis', plan: r.plan }); })
  router.post('/call/Tonsil', (req, res) => { const r = Engine.Tonsil(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Tonsil', plan: r.plan }); })
  router.post('/call/Hoarseness', (req, res) => { const r = Engine.Hoarseness(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Hoarseness', plan: r.plan }); })
  router.post('/call/Epistaxis', (req, res) => { const r = Engine.Epistaxis(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Epistaxis', plan: r.plan }); })
  router.post('/call/Vertigo', (req, res) => { const r = Engine.Vertigo(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Vertigo', plan: r.plan }); })
  router.post('/call/Tinnitus', (req, res) => { const r = Engine.Tinnitus(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Tinnitus', plan: r.plan }); })
  router.post('/call/Allergic', (req, res) => { const r = Engine.Allergic(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Allergic', plan: r.plan }); })
  router.post('/call/Vertigo2', (req, res) => { const r = Engine.Vertigo2(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Vertigo2', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
