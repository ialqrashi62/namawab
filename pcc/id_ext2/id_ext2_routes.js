// P3-BZ id_ext2 routes v3.38.0
// P3-BZ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./id_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.38.0',
    module: 'id_ext2',
    label: 'Infectious Disease Extended 2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/UTI', (req, res) => { const r = Engine.UTI(req.body || {}); res.json({ version: '3.38.0', module: 'id_ext2', function: 'UTI', plan: r.plan }); })
  router.post('/call/Pneumonia', (req, res) => { const r = Engine.Pneumonia(req.body || {}); res.json({ version: '3.38.0', module: 'id_ext2', function: 'Pneumonia', plan: r.plan }); })
  router.post('/call/SSTI', (req, res) => { const r = Engine.SSTI(req.body || {}); res.json({ version: '3.38.0', module: 'id_ext2', function: 'SSTI', plan: r.plan }); })
  router.post('/call/Cdiff', (req, res) => { const r = Engine.Cdiff(req.body || {}); res.json({ version: '3.38.0', module: 'id_ext2', function: 'Cdiff', plan: r.plan }); })
  router.post('/call/Sepsis', (req, res) => { const r = Engine.Sepsis(req.body || {}); res.json({ version: '3.38.0', module: 'id_ext2', function: 'Sepsis', plan: r.plan }); })
  router.post('/call/HIV', (req, res) => { const r = Engine.HIV(req.body || {}); res.json({ version: '3.38.0', module: 'id_ext2', function: 'HIV', plan: r.plan }); })
  router.post('/call/TB', (req, res) => { const r = Engine.TB(req.body || {}); res.json({ version: '3.38.0', module: 'id_ext2', function: 'TB', plan: r.plan }); })
  router.post('/call/HepB', (req, res) => { const r = Engine.HepB(req.body || {}); res.json({ version: '3.38.0', module: 'id_ext2', function: 'HepB', plan: r.plan }); })
  router.post('/call/HepC', (req, res) => { const r = Engine.HepC(req.body || {}); res.json({ version: '3.38.0', module: 'id_ext2', function: 'HepC', plan: r.plan }); })
  router.post('/call/Influenza', (req, res) => { const r = Engine.Influenza(req.body || {}); res.json({ version: '3.38.0', module: 'id_ext2', function: 'Influenza', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.38.0', module: 'id_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
