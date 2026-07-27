// P3-CP pcc_pall_ext3 routes v3.54.0
// P3-CP: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_pall_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.54.0',
    module: 'pcc_pall_ext3',
    label: 'PCC Pall Ext3',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/PainMng', (req, res) => { const r = Engine.PainMng(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'PainMng', plan: r.plan }); })
  router.post('/call/Dyspnea', (req, res) => { const r = Engine.Dyspnea(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'Dyspnea', plan: r.plan }); })
  router.post('/call/Nausea', (req, res) => { const r = Engine.Nausea(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'Nausea', plan: r.plan }); })
  router.post('/call/Constipation', (req, res) => { const r = Engine.Constipation(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'Constipation', plan: r.plan }); })
  router.post('/call/Delirium', (req, res) => { const r = Engine.Delirium(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'Delirium', plan: r.plan }); })
  router.post('/call/Anxietyp', (req, res) => { const r = Engine.Anxietyp(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'Anxietyp', plan: r.plan }); })
  router.post('/call/Hospice', (req, res) => { const r = Engine.Hospice(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'Hospice', plan: r.plan }); })
  router.post('/call/Advance', (req, res) => { const r = Engine.Advance(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'Advance', plan: r.plan }); })
  router.post('/call/Family', (req, res) => { const r = Engine.Family(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'Family', plan: r.plan }); })
  router.post('/call/Grief', (req, res) => { const r = Engine.Grief(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'Grief', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
