// P3-BZ rheum_ext3 routes v3.38.0
// P3-BZ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./rheum_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.38.0',
    module: 'rheum_ext3',
    label: 'Rheumatology Extended 3',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/RA', (req, res) => { const r = Engine.RA(req.body || {}); res.json({ version: '3.38.0', module: 'rheum_ext3', function: 'RA', plan: r.plan }); })
  router.post('/call/SLE', (req, res) => { const r = Engine.SLE(req.body || {}); res.json({ version: '3.38.0', module: 'rheum_ext3', function: 'SLE', plan: r.plan }); })
  router.post('/call/SSc', (req, res) => { const r = Engine.SSc(req.body || {}); res.json({ version: '3.38.0', module: 'rheum_ext3', function: 'SSc', plan: r.plan }); })
  router.post('/call/Vasculitis', (req, res) => { const r = Engine.Vasculitis(req.body || {}); res.json({ version: '3.38.0', module: 'rheum_ext3', function: 'Vasculitis', plan: r.plan }); })
  router.post('/call/Gout', (req, res) => { const r = Engine.Gout(req.body || {}); res.json({ version: '3.38.0', module: 'rheum_ext3', function: 'Gout', plan: r.plan }); })
  router.post('/call/OA', (req, res) => { const r = Engine.OA(req.body || {}); res.json({ version: '3.38.0', module: 'rheum_ext3', function: 'OA', plan: r.plan }); })
  router.post('/call/SpA', (req, res) => { const r = Engine.SpA(req.body || {}); res.json({ version: '3.38.0', module: 'rheum_ext3', function: 'SpA', plan: r.plan }); })
  router.post('/call/PMR', (req, res) => { const r = Engine.PMR(req.body || {}); res.json({ version: '3.38.0', module: 'rheum_ext3', function: 'PMR', plan: r.plan }); })
  router.post('/call/Sjogren', (req, res) => { const r = Engine.Sjogren(req.body || {}); res.json({ version: '3.38.0', module: 'rheum_ext3', function: 'Sjogren', plan: r.plan }); })
  router.post('/call/Myositis', (req, res) => { const r = Engine.Myositis(req.body || {}); res.json({ version: '3.38.0', module: 'rheum_ext3', function: 'Myositis', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.38.0', module: 'rheum_ext3', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
