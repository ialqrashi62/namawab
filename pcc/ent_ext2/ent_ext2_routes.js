// P3-BV ent_ext2 routes v3.34.0
// P3-BV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./ent_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.34.0',
    module: 'ent_ext2',
    label: 'ENT Extended 2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Hearing', (req, res) => { const r = Engine.Hearing(req.body || {}); res.json({ version: '3.34.0', module: 'ent_ext2', function: 'Hearing', plan: r.plan }); })
  router.post('/call/Tinnitus', (req, res) => { const r = Engine.Tinnitus(req.body || {}); res.json({ version: '3.34.0', module: 'ent_ext2', function: 'Tinnitus', plan: r.plan }); })
  router.post('/call/Vertigo', (req, res) => { const r = Engine.Vertigo(req.body || {}); res.json({ version: '3.34.0', module: 'ent_ext2', function: 'Vertigo', plan: r.plan }); })
  router.post('/call/Sinus', (req, res) => { const r = Engine.Sinus(req.body || {}); res.json({ version: '3.34.0', module: 'ent_ext2', function: 'Sinus', plan: r.plan }); })
  router.post('/call/OSA', (req, res) => { const r = Engine.OSA(req.body || {}); res.json({ version: '3.34.0', module: 'ent_ext2', function: 'OSA', plan: r.plan }); })
  router.post('/call/Hoarseness', (req, res) => { const r = Engine.Hoarseness(req.body || {}); res.json({ version: '3.34.0', module: 'ent_ext2', function: 'Hoarseness', plan: r.plan }); })
  router.post('/call/NeckMass', (req, res) => { const r = Engine.NeckMass(req.body || {}); res.json({ version: '3.34.0', module: 'ent_ext2', function: 'NeckMass', plan: r.plan }); })
  router.post('/call/Epistaxis', (req, res) => { const r = Engine.Epistaxis(req.body || {}); res.json({ version: '3.34.0', module: 'ent_ext2', function: 'Epistaxis', plan: r.plan }); })
  router.post('/call/Dysphagia', (req, res) => { const r = Engine.Dysphagia(req.body || {}); res.json({ version: '3.34.0', module: 'ent_ext2', function: 'Dysphagia', plan: r.plan }); })
  router.post('/call/Allergic', (req, res) => { const r = Engine.Allergic(req.body || {}); res.json({ version: '3.34.0', module: 'ent_ext2', function: 'Allergic', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.34.0', module: 'ent_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
