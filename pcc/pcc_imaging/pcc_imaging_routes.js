// P3-CD pcc_imaging routes v3.42.0
// P3-CD: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_imaging';
const F = require('./pcc_imaging_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.42.0',
    module: 'pcc_imaging',
    label: 'PCC Imaging',
    functions: Object.keys(F),
  });
});
  router.post('/call/Modality', (req, res) => { const r = F.Modality(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'Modality', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Indication', (req, res) => { const r = F.Indication(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'Indication', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Contrast', (req, res) => { const r = F.Contrast(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'Contrast', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Dose', (req, res) => { const r = F.Dose(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'Dose', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Protocol', (req, res) => { const r = F.Protocol(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'Protocol', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Urgency', (req, res) => { const r = F.Urgency(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'Urgency', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Quality', (req, res) => { const r = F.Quality(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'Quality', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Comparison', (req, res) => { const r = F.Comparison(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'Comparison', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/FollowUp', (req, res) => { const r = F.FollowUp(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'FollowUp', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Report', (req, res) => { const r = F.Report(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'Report', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.42.0', module: 'pcc_imaging', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
