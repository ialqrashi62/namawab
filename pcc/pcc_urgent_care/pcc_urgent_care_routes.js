// P3-CT pcc_urgent_care routes v3.58.0
// P3-CT: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_urgent_care_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.58.0',
    module: 'pcc_urgent_care',
    label: 'PCC Urgent Care',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/WalkIn', (req, res) => { const r = Engine.WalkIn(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'WalkIn', plan: r.plan }); })
  router.post('/call/InjuryType', (req, res) => { const r = Engine.InjuryType(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'InjuryType', plan: r.plan }); })
  router.post('/call/Illness', (req, res) => { const r = Engine.Illness(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'Illness', plan: r.plan }); })
  router.post('/call/Stitches', (req, res) => { const r = Engine.Stitches(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'Stitches', plan: r.plan }); })
  router.post('/call/Splint', (req, res) => { const r = Engine.Splint(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'Splint', plan: r.plan }); })
  router.post('/call/Neb', (req, res) => { const r = Engine.Neb(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'Neb', plan: r.plan }); })
  router.post('/call/EkgUrgent', (req, res) => { const r = Engine.EkgUrgent(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'EkgUrgent', plan: r.plan }); })
  router.post('/call/XrayOnsite', (req, res) => { const r = Engine.XrayOnsite(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'XrayOnsite', plan: r.plan }); })
  router.post('/call/LabRapid', (req, res) => { const r = Engine.LabRapid(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'LabRapid', plan: r.plan }); })
  router.post('/call/DcUrgent', (req, res) => { const r = Engine.DcUrgent(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'DcUrgent', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
