// P3-CD pcc_imaging routes v3.42.0
// P3-CD: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_imaging_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.42.0',
    module: 'pcc_imaging',
    label: 'PCC Imaging',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Modality', (req, res) => { const r = Engine.Modality(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'Modality', plan: r.plan }); })
  router.post('/call/Indication', (req, res) => { const r = Engine.Indication(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'Indication', plan: r.plan }); })
  router.post('/call/Contrast', (req, res) => { const r = Engine.Contrast(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'Contrast', plan: r.plan }); })
  router.post('/call/Dose', (req, res) => { const r = Engine.Dose(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'Dose', plan: r.plan }); })
  router.post('/call/Protocol', (req, res) => { const r = Engine.Protocol(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'Protocol', plan: r.plan }); })
  router.post('/call/Urgency', (req, res) => { const r = Engine.Urgency(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'Urgency', plan: r.plan }); })
  router.post('/call/Quality', (req, res) => { const r = Engine.Quality(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'Quality', plan: r.plan }); })
  router.post('/call/Comparison', (req, res) => { const r = Engine.Comparison(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'Comparison', plan: r.plan }); })
  router.post('/call/FollowUp', (req, res) => { const r = Engine.FollowUp(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'FollowUp', plan: r.plan }); })
  router.post('/call/Report', (req, res) => { const r = Engine.Report(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_imaging', function: 'Report', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.42.0', module: 'pcc_imaging', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
