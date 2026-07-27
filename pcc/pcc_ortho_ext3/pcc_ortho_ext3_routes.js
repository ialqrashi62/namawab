// P3-CL pcc_ortho_ext3 routes v3.50.0
// P3-CL: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_ortho_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.50.0',
    module: 'pcc_ortho_ext3',
    label: 'PCC Ortho Ext3',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Fx', (req, res) => { const r = Engine.Fx(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Fx', plan: r.plan }); })
  router.post('/call/Joint', (req, res) => { const r = Engine.Joint(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Joint', plan: r.plan }); })
  router.post('/call/Spine', (req, res) => { const r = Engine.Spine(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Spine', plan: r.plan }); })
  router.post('/call/Sports', (req, res) => { const r = Engine.Sports(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Sports', plan: r.plan }); })
  router.post('/call/Pediatric', (req, res) => { const r = Engine.Pediatric(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Pediatric', plan: r.plan }); })
  router.post('/call/Tumor', (req, res) => { const r = Engine.Tumor(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Tumor', plan: r.plan }); })
  router.post('/call/Hand', (req, res) => { const r = Engine.Hand(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Hand', plan: r.plan }); })
  router.post('/call/Foot', (req, res) => { const r = Engine.Foot(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Foot', plan: r.plan }); })
  router.post('/call/Postop', (req, res) => { const r = Engine.Postop(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Postop', plan: r.plan }); })
  router.post('/call/Rehab', (req, res) => { const r = Engine.Rehab(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Rehab', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
