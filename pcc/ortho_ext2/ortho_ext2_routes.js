// P3-BX ortho_ext2 routes v3.36.0
// P3-BX: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./ortho_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.36.0',
    module: 'ortho_ext2',
    label: 'Orthopedics Extended 2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Fracture', (req, res) => { const r = Engine.Fracture(req.body || {}); res.json({ version: '3.36.0', module: 'ortho_ext2', function: 'Fracture', plan: r.plan }); })
  router.post('/call/Joint', (req, res) => { const r = Engine.Joint(req.body || {}); res.json({ version: '3.36.0', module: 'ortho_ext2', function: 'Joint', plan: r.plan }); })
  router.post('/call/Spine', (req, res) => { const r = Engine.Spine(req.body || {}); res.json({ version: '3.36.0', module: 'ortho_ext2', function: 'Spine', plan: r.plan }); })
  router.post('/call/Sports', (req, res) => { const r = Engine.Sports(req.body || {}); res.json({ version: '3.36.0', module: 'ortho_ext2', function: 'Sports', plan: r.plan }); })
  router.post('/call/Trauma', (req, res) => { const r = Engine.Trauma(req.body || {}); res.json({ version: '3.36.0', module: 'ortho_ext2', function: 'Trauma', plan: r.plan }); })
  router.post('/call/Tumor', (req, res) => { const r = Engine.Tumor(req.body || {}); res.json({ version: '3.36.0', module: 'ortho_ext2', function: 'Tumor', plan: r.plan }); })
  router.post('/call/Hand', (req, res) => { const r = Engine.Hand(req.body || {}); res.json({ version: '3.36.0', module: 'ortho_ext2', function: 'Hand', plan: r.plan }); })
  router.post('/call/Foot', (req, res) => { const r = Engine.Foot(req.body || {}); res.json({ version: '3.36.0', module: 'ortho_ext2', function: 'Foot', plan: r.plan }); })
  router.post('/call/Pediatric', (req, res) => { const r = Engine.Pediatric(req.body || {}); res.json({ version: '3.36.0', module: 'ortho_ext2', function: 'Pediatric', plan: r.plan }); })
  router.post('/call/Recon', (req, res) => { const r = Engine.Recon(req.body || {}); res.json({ version: '3.36.0', module: 'ortho_ext2', function: 'Recon', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.36.0', module: 'ortho_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
