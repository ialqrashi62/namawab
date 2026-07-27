// P3-BS trauma_ext routes v3.31.0
// P3-BS: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./trauma_ext_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.31.0',
    module: 'trauma_ext',
    label: 'Trauma Extended',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Triage', (req, res) => { const r = Engine.Triage(req.body || {}); res.json({ version: '3.31.0', module: 'trauma_ext', function: 'Triage', plan: r.plan }); })
  router.post('/call/Primary', (req, res) => { const r = Engine.Primary(req.body || {}); res.json({ version: '3.31.0', module: 'trauma_ext', function: 'Primary', plan: r.plan }); })
  router.post('/call/Secondary', (req, res) => { const r = Engine.Secondary(req.body || {}); res.json({ version: '3.31.0', module: 'trauma_ext', function: 'Secondary', plan: r.plan }); })
  router.post('/call/FAST', (req, res) => { const r = Engine.FAST(req.body || {}); res.json({ version: '3.31.0', module: 'trauma_ext', function: 'FAST', plan: r.plan }); })
  router.post('/call/Head', (req, res) => { const r = Engine.Head(req.body || {}); res.json({ version: '3.31.0', module: 'trauma_ext', function: 'Head', plan: r.plan }); })
  router.post('/call/Chest', (req, res) => { const r = Engine.Chest(req.body || {}); res.json({ version: '3.31.0', module: 'trauma_ext', function: 'Chest', plan: r.plan }); })
  router.post('/call/Abdomen', (req, res) => { const r = Engine.Abdomen(req.body || {}); res.json({ version: '3.31.0', module: 'trauma_ext', function: 'Abdomen', plan: r.plan }); })
  router.post('/call/Pelvis', (req, res) => { const r = Engine.Pelvis(req.body || {}); res.json({ version: '3.31.0', module: 'trauma_ext', function: 'Pelvis', plan: r.plan }); })
  router.post('/call/Spine', (req, res) => { const r = Engine.Spine(req.body || {}); res.json({ version: '3.31.0', module: 'trauma_ext', function: 'Spine', plan: r.plan }); })
  router.post('/call/MTP', (req, res) => { const r = Engine.MTP(req.body || {}); res.json({ version: '3.31.0', module: 'trauma_ext', function: 'MTP', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.31.0', module: 'trauma_ext', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
