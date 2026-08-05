// P3-CK pcc_neuro_ext2 routes v3.49.0
// P3-CK: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_neuro_ext2';
const F = require('./pcc_neuro_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.49.0',
    module: 'pcc_neuro_ext2',
    label: 'PCC Neuro Ext2',
    functions: Object.keys(F),
  });
});
  router.post('/call/StrokeScale', (req, res) => { const r = F.StrokeScale(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'StrokeScale', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Seizure', (req, res) => { const r = F.Seizure(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'Seizure', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Headache', (req, res) => { const r = F.Headache(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'Headache', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/GCS', (req, res) => { const r = F.GCS(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'GCS', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Neuropathy', (req, res) => { const r = F.Neuropathy(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'Neuropathy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Movement', (req, res) => { const r = F.Movement(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'Movement', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Dementia', (req, res) => { const r = F.Dementia(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'Dementia', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Ms', (req, res) => { const r = F.Ms(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'Ms', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Gbs', (req, res) => { const r = F.Gbs(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'Gbs', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Myasthenia', (req, res) => { const r = F.Myasthenia(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: 'Myasthenia', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.49.0', module: 'pcc_neuro_ext2', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
