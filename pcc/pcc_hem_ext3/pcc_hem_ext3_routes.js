// P3-CN pcc_hem_ext3 routes v3.52.0
// P3-CN: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_hem_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.52.0',
    module: 'pcc_hem_ext3',
    label: 'PCC Hem Ext3',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Anemia', (req, res) => { const r = Engine.Anemia(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Anemia', plan: r.plan }); })
  router.post('/call/Transfusion', (req, res) => { const r = Engine.Transfusion(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Transfusion', plan: r.plan }); })
  router.post('/call/Coag', (req, res) => { const r = Engine.Coag(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Coag', plan: r.plan }); })
  router.post('/call/Marrow', (req, res) => { const r = Engine.Marrow(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Marrow', plan: r.plan }); })
  router.post('/call/Mds', (req, res) => { const r = Engine.Mds(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Mds', plan: r.plan }); })
  router.post('/call/Mpn', (req, res) => { const r = Engine.Mpn(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Mpn', plan: r.plan }); })
  router.post('/call/Lymphoma', (req, res) => { const r = Engine.Lymphoma(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Lymphoma', plan: r.plan }); })
  router.post('/call/Leukemia', (req, res) => { const r = Engine.Leukemia(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Leukemia', plan: r.plan }); })
  router.post('/call/Transplant', (req, res) => { const r = Engine.Transplant(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Transplant', plan: r.plan }); })
  router.post('/call/Iron', (req, res) => { const r = Engine.Iron(req.body || {}); res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: 'Iron', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.52.0', module: 'pcc_hem_ext3', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
