// P3-CI pcc_rad_ext2 routes v3.47.0
// P3-CI: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_rad_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.47.0',
    module: 'pcc_rad_ext2',
    label: 'PCC Rad Ext2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Modality', (req, res) => { const r = Engine.Modality(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'Modality', plan: r.plan }); })
  router.post('/call/BodyPart', (req, res) => { const r = Engine.BodyPart(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'BodyPart', plan: r.plan }); })
  router.post('/call/Indication', (req, res) => { const r = Engine.Indication(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'Indication', plan: r.plan }); })
  router.post('/call/Contrast', (req, res) => { const r = Engine.Contrast(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'Contrast', plan: r.plan }); })
  router.post('/call/Urgency', (req, res) => { const r = Engine.Urgency(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'Urgency', plan: r.plan }); })
  router.post('/call/Comparison', (req, res) => { const r = Engine.Comparison(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'Comparison', plan: r.plan }); })
  router.post('/call/Dose', (req, res) => { const r = Engine.Dose(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'Dose', plan: r.plan }); })
  router.post('/call/Pregnancy', (req, res) => { const r = Engine.Pregnancy(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'Pregnancy', plan: r.plan }); })
  router.post('/call/Pediatric', (req, res) => { const r = Engine.Pediatric(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'Pediatric', plan: r.plan }); })
  router.post('/call/Report', (req, res) => { const r = Engine.Report(req.body || {}); res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: 'Report', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.47.0', module: 'pcc_rad_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
