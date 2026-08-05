// P3-CI pcc_rad_ext2 routes v3.47.0
// P3-CI: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_rad_ext2';
const F = require('./pcc_rad_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.47.0',
    module: 'pcc_rad_ext2',
    label: 'PCC Rad Ext2',
    functions: Object.keys(F),
  });
});
  router.post('/call/Modality', (req, res) => { const r = F.Modality(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'Modality', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/BodyPart', (req, res) => { const r = F.BodyPart(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'BodyPart', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Indication', (req, res) => { const r = F.Indication(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'Indication', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Contrast', (req, res) => { const r = F.Contrast(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'Contrast', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Urgency', (req, res) => { const r = F.Urgency(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'Urgency', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Comparison', (req, res) => { const r = F.Comparison(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'Comparison', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Dose', (req, res) => { const r = F.Dose(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'Dose', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Pregnancy', (req, res) => { const r = F.Pregnancy(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'Pregnancy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Pediatric', (req, res) => { const r = F.Pediatric(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'Pediatric', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Report', (req, res) => { const r = F.Report(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'Report', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
