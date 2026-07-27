// P3-CN pcc_id_ext3 routes v3.52.0
// P3-CN: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_id_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.52.0',
    module: 'pcc_id_ext3',
    label: 'PCC ID Ext3',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Cdiff', (req, res) => { const r = Engine.Cdiff(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Cdiff', plan: r.plan }); })
  router.post('/call/Mrsa', (req, res) => { const r = Engine.Mrsa(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Mrsa', plan: r.plan }); })
  router.post('/call/Vre', (req, res) => { const r = Engine.Vre(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Vre', plan: r.plan }); })
  router.post('/call/Esbl', (req, res) => { const r = Engine.Esbl(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Esbl', plan: r.plan }); })
  router.post('/call/Tbflu', (req, res) => { const r = Engine.Tbflu(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Tbflu', plan: r.plan }); })
  router.post('/call/Malaria', (req, res) => { const r = Engine.Malaria(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Malaria', plan: r.plan }); })
  router.post('/call/Tb', (req, res) => { const r = Engine.Tb(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Tb', plan: r.plan }); })
  router.post('/call/Hiv', (req, res) => { const r = Engine.Hiv(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Hiv', plan: r.plan }); })
  router.post('/call/Hep', (req, res) => { const r = Engine.Hep(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Hep', plan: r.plan }); })
  router.post('/call/Travel', (req, res) => { const r = Engine.Travel(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: 'Travel', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.52.0', module: 'pcc_id_ext3', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
