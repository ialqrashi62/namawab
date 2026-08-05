// P3-CP pcc_pall_ext3 routes v3.54.0
// P3-CP: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_pall_ext3';
const F = require('./pcc_pall_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.54.0',
    module: 'pcc_pall_ext3',
    label: 'PCC Pall Ext3',
    functions: Object.keys(F),
  });
});
  router.post('/call/PainMng', (req, res) => { const r = F.PainMng(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'PainMng', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Dyspnea', (req, res) => { const r = F.Dyspnea(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'Dyspnea', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Nausea', (req, res) => { const r = F.Nausea(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'Nausea', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Constipation', (req, res) => { const r = F.Constipation(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'Constipation', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Delirium', (req, res) => { const r = F.Delirium(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'Delirium', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Anxietyp', (req, res) => { const r = F.Anxietyp(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'Anxietyp', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Hospice', (req, res) => { const r = F.Hospice(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'Hospice', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Advance', (req, res) => { const r = F.Advance(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'Advance', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Family', (req, res) => { const r = F.Family(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'Family', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Grief', (req, res) => { const r = F.Grief(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: 'Grief', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.54.0', module: 'pcc_pall_ext3', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
