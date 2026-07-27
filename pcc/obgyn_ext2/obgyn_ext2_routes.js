// P3-BT obgyn_ext2 routes v3.32.0
// P3-BT: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./obgyn_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.32.0',
    module: 'obgyn_ext2',
    label: 'OB/GYN Extended 2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Pregnancy', (req, res) => { const r = Engine.Pregnancy(req.body || {}); res.json({ version: '3.32.0', module: 'obgyn_ext2', function: 'Pregnancy', plan: r.plan }); })
  router.post('/call/PreEclampsia', (req, res) => { const r = Engine.PreEclampsia(req.body || {}); res.json({ version: '3.32.0', module: 'obgyn_ext2', function: 'PreEclampsia', plan: r.plan }); })
  router.post('/call/GDM', (req, res) => { const r = Engine.GDM(req.body || {}); res.json({ version: '3.32.0', module: 'obgyn_ext2', function: 'GDM', plan: r.plan }); })
  router.post('/call/PPROM', (req, res) => { const r = Engine.PPROM(req.body || {}); res.json({ version: '3.32.0', module: 'obgyn_ext2', function: 'PPROM', plan: r.plan }); })
  router.post('/call/PPH', (req, res) => { const r = Engine.PPH(req.body || {}); res.json({ version: '3.32.0', module: 'obgyn_ext2', function: 'PPH', plan: r.plan }); })
  router.post('/call/Ectopic', (req, res) => { const r = Engine.Ectopic(req.body || {}); res.json({ version: '3.32.0', module: 'obgyn_ext2', function: 'Ectopic', plan: r.plan }); })
  router.post('/call/Induction', (req, res) => { const r = Engine.Induction(req.body || {}); res.json({ version: '3.32.0', module: 'obgyn_ext2', function: 'Induction', plan: r.plan }); })
  router.post('/call/GynCancer', (req, res) => { const r = Engine.GynCancer(req.body || {}); res.json({ version: '3.32.0', module: 'obgyn_ext2', function: 'GynCancer', plan: r.plan }); })
  router.post('/call/Infertility', (req, res) => { const r = Engine.Infertility(req.body || {}); res.json({ version: '3.32.0', module: 'obgyn_ext2', function: 'Infertility', plan: r.plan }); })
  router.post('/call/Menopause', (req, res) => { const r = Engine.Menopause(req.body || {}); res.json({ version: '3.32.0', module: 'obgyn_ext2', function: 'Menopause', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.32.0', module: 'obgyn_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
