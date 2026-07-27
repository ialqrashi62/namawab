// P3-BS geri_ext routes v3.31.0
// P3-BS: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./geri_ext_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.31.0',
    module: 'geri_ext',
    label: 'Geriatrics Extended',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Frailty', (req, res) => { const r = Engine.Frailty(req.body || {}); res.json({ version: '3.31.0', module: 'geri_ext', function: 'Frailty', plan: r.plan }); })
  router.post('/call/Polypharm', (req, res) => { const r = Engine.Polypharm(req.body || {}); res.json({ version: '3.31.0', module: 'geri_ext', function: 'Polypharm', plan: r.plan }); })
  router.post('/call/Delirium', (req, res) => { const r = Engine.Delirium(req.body || {}); res.json({ version: '3.31.0', module: 'geri_ext', function: 'Delirium', plan: r.plan }); })
  router.post('/call/Falls', (req, res) => { const r = Engine.Falls(req.body || {}); res.json({ version: '3.31.0', module: 'geri_ext', function: 'Falls', plan: r.plan }); })
  router.post('/call/Dementia', (req, res) => { const r = Engine.Dementia(req.body || {}); res.json({ version: '3.31.0', module: 'geri_ext', function: 'Dementia', plan: r.plan }); })
  router.post('/call/Nutrition', (req, res) => { const r = Engine.Nutrition(req.body || {}); res.json({ version: '3.31.0', module: 'geri_ext', function: 'Nutrition', plan: r.plan }); })
  router.post('/call/PressureUlcer', (req, res) => { const r = Engine.PressureUlcer(req.body || {}); res.json({ version: '3.31.0', module: 'geri_ext', function: 'PressureUlcer', plan: r.plan }); })
  router.post('/call/Depression', (req, res) => { const r = Engine.Depression(req.body || {}); res.json({ version: '3.31.0', module: 'geri_ext', function: 'Depression', plan: r.plan }); })
  router.post('/call/Advance', (req, res) => { const r = Engine.Advance(req.body || {}); res.json({ version: '3.31.0', module: 'geri_ext', function: 'Advance', plan: r.plan }); })
  router.post('/call/Sarcopenia', (req, res) => { const r = Engine.Sarcopenia(req.body || {}); res.json({ version: '3.31.0', module: 'geri_ext', function: 'Sarcopenia', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.31.0', module: 'geri_ext', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
