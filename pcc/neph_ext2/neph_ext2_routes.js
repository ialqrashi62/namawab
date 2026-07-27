// P3-BQ neph_ext2 routes v3.29.0
// P3-BQ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./neph_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.29.0',
    module: 'neph_ext2',
    label: 'Nephrology Extended 2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/CKD', (req, res) => { const r = Engine.CKD(req.body || {}); res.json({ version: '3.29.0', module: 'neph_ext2', function: 'CKD', plan: r.plan }); })
  router.post('/call/AKI', (req, res) => { const r = Engine.AKI(req.body || {}); res.json({ version: '3.29.0', module: 'neph_ext2', function: 'AKI', plan: r.plan }); })
  router.post('/call/GN', (req, res) => { const r = Engine.GN(req.body || {}); res.json({ version: '3.29.0', module: 'neph_ext2', function: 'GN', plan: r.plan }); })
  router.post('/call/HTNEmerg', (req, res) => { const r = Engine.HTNEmerg(req.body || {}); res.json({ version: '3.29.0', module: 'neph_ext2', function: 'HTNEmerg', plan: r.plan }); })
  router.post('/call/DialysisInit', (req, res) => { const r = Engine.DialysisInit(req.body || {}); res.json({ version: '3.29.0', module: 'neph_ext2', function: 'DialysisInit', plan: r.plan }); })
  router.post('/call/Electrolytes', (req, res) => { const r = Engine.Electrolytes(req.body || {}); res.json({ version: '3.29.0', module: 'neph_ext2', function: 'Electrolytes', plan: r.plan }); })
  router.post('/call/Rhabdo', (req, res) => { const r = Engine.Rhabdo(req.body || {}); res.json({ version: '3.29.0', module: 'neph_ext2', function: 'Rhabdo', plan: r.plan }); })
  router.post('/call/NephroCheck', (req, res) => { const r = Engine.NephroCheck(req.body || {}); res.json({ version: '3.29.0', module: 'neph_ext2', function: 'NephroCheck', plan: r.plan }); })
  router.post('/call/PediatricNeph', (req, res) => { const r = Engine.PediatricNeph(req.body || {}); res.json({ version: '3.29.0', module: 'neph_ext2', function: 'PediatricNeph', plan: r.plan }); })
  router.post('/call/TransplantKidney', (req, res) => { const r = Engine.TransplantKidney(req.body || {}); res.json({ version: '3.29.0', module: 'neph_ext2', function: 'TransplantKidney', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.29.0', module: 'neph_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
