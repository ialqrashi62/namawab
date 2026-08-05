// P3-CT pcc_urgent_care routes v3.58.0
// P3-CT: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_urgent_care';
const F = require('./pcc_urgent_care_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.58.0',
    module: 'pcc_urgent_care',
    label: 'PCC Urgent Care',
    functions: Object.keys(F),
  });
});
  router.post('/call/WalkIn', (req, res) => { const r = F.WalkIn(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'WalkIn', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/InjuryType', (req, res) => { const r = F.InjuryType(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'InjuryType', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Illness', (req, res) => { const r = F.Illness(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'Illness', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Stitches', (req, res) => { const r = F.Stitches(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'Stitches', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Splint', (req, res) => { const r = F.Splint(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'Splint', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Neb', (req, res) => { const r = F.Neb(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'Neb', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/EkgUrgent', (req, res) => { const r = F.EkgUrgent(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'EkgUrgent', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/XrayOnsite', (req, res) => { const r = F.XrayOnsite(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'XrayOnsite', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/LabRapid', (req, res) => { const r = F.LabRapid(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'LabRapid', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/DcUrgent', (req, res) => { const r = F.DcUrgent(req.body || {}); res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: 'DcUrgent', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.58.0', module: 'pcc_urgent_care', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
