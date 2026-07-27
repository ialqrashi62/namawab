// P3-CV pcc_sports_med routes v3.60.0
// P3-CV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_sports_med_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.60.0',
    module: 'pcc_sports_med',
    label: 'PCC Sports Medicine',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Injury', (req, res) => { const r = Engine.Injury(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'Injury', plan: r.plan }); })
  router.post('/call/ReturnToPlay', (req, res) => { const r = Engine.ReturnToPlay(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'ReturnToPlay', plan: r.plan }); })
  router.post('/call/Concussion', (req, res) => { const r = Engine.Concussion(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'Concussion', plan: r.plan }); })
  router.post('/call/CardiacScreen', (req, res) => { const r = Engine.CardiacScreen(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'CardiacScreen', plan: r.plan }); })
  router.post('/call/Hydration', (req, res) => { const r = Engine.Hydration(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'Hydration', plan: r.plan }); })
  router.post('/call/Heat', (req, res) => { const r = Engine.Heat(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'Heat', plan: r.plan }); })
  router.post('/call/Overuse', (req, res) => { const r = Engine.Overuse(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'Overuse', plan: r.plan }); })
  router.post('/call/Doping', (req, res) => { const r = Engine.Doping(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'Doping', plan: r.plan }); })
  router.post('/call/Nutrition', (req, res) => { const r = Engine.Nutrition(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'Nutrition', plan: r.plan }); })
  router.post('/call/Imaging', (req, res) => { const r = Engine.Imaging(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'Imaging', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.60.0', module: 'pcc_sports_med', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
