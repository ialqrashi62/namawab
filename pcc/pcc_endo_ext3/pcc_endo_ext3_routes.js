// P3-CM pcc_endo_ext3 routes v3.51.0
// P3-CM: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_endo_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.51.0',
    module: 'pcc_endo_ext3',
    label: 'PCC Endo Ext3',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/DmType', (req, res) => { const r = Engine.DmType(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'DmType', plan: r.plan }); })
  router.post('/call/A1c', (req, res) => { const r = Engine.A1c(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'A1c', plan: r.plan }); })
  router.post('/call/Thyroid', (req, res) => { const r = Engine.Thyroid(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'Thyroid', plan: r.plan }); })
  router.post('/call/Calcium', (req, res) => { const r = Engine.Calcium(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'Calcium', plan: r.plan }); })
  router.post('/call/Adrenal', (req, res) => { const r = Engine.Adrenal(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'Adrenal', plan: r.plan }); })
  router.post('/call/Pituitary', (req, res) => { const r = Engine.Pituitary(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'Pituitary', plan: r.plan }); })
  router.post('/call/Osteo', (req, res) => { const r = Engine.Osteo(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'Osteo', plan: r.plan }); })
  router.post('/call/Pcos', (req, res) => { const r = Engine.Pcos(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'Pcos', plan: r.plan }); })
  router.post('/call/Dka', (req, res) => { const r = Engine.Dka(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'Dka', plan: r.plan }); })
  router.post('/call/Lipid', (req, res) => { const r = Engine.Lipid(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'Lipid', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
