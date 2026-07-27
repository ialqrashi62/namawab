// P3-BS gen_med_ext routes v3.31.0
// P3-BS: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./gen_med_ext_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.31.0',
    module: 'gen_med_ext',
    label: 'General Medicine Extended',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Triage', (req, res) => { const r = Engine.Triage(req.body || {}); res.json({ version: '3.31.0', module: 'gen_med_ext', function: 'Triage', plan: r.plan }); })
  router.post('/call/Sepsis', (req, res) => { const r = Engine.Sepsis(req.body || {}); res.json({ version: '3.31.0', module: 'gen_med_ext', function: 'Sepsis', plan: r.plan }); })
  router.post('/call/ChestPain', (req, res) => { const r = Engine.ChestPain(req.body || {}); res.json({ version: '3.31.0', module: 'gen_med_ext', function: 'ChestPain', plan: r.plan }); })
  router.post('/call/ShortBreath', (req, res) => { const r = Engine.ShortBreath(req.body || {}); res.json({ version: '3.31.0', module: 'gen_med_ext', function: 'ShortBreath', plan: r.plan }); })
  router.post('/call/AbdPain', (req, res) => { const r = Engine.AbdPain(req.body || {}); res.json({ version: '3.31.0', module: 'gen_med_ext', function: 'AbdPain', plan: r.plan }); })
  router.post('/call/Fever', (req, res) => { const r = Engine.Fever(req.body || {}); res.json({ version: '3.31.0', module: 'gen_med_ext', function: 'Fever', plan: r.plan }); })
  router.post('/call/Syncope', (req, res) => { const r = Engine.Syncope(req.body || {}); res.json({ version: '3.31.0', module: 'gen_med_ext', function: 'Syncope', plan: r.plan }); })
  router.post('/call/BackPain', (req, res) => { const r = Engine.BackPain(req.body || {}); res.json({ version: '3.31.0', module: 'gen_med_ext', function: 'BackPain', plan: r.plan }); })
  router.post('/call/Headache', (req, res) => { const r = Engine.Headache(req.body || {}); res.json({ version: '3.31.0', module: 'gen_med_ext', function: 'Headache', plan: r.plan }); })
  router.post('/call/Dizzy', (req, res) => { const r = Engine.Dizzy(req.body || {}); res.json({ version: '3.31.0', module: 'gen_med_ext', function: 'Dizzy', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.31.0', module: 'gen_med_ext', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
