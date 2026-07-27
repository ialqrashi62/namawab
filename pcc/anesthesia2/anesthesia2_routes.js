// P3-BR anesthesia2 routes v3.30.0
// P3-BR: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./anesthesia2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.30.0',
    module: 'anesthesia2',
    label: 'Anesthesia 2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/ASAClass', (req, res) => { const r = Engine.ASAClass(req.body || {}); res.json({ version: '3.30.0', module: 'anesthesia2', function: 'ASAClass', plan: r.plan }); })
  router.post('/call/Airway', (req, res) => { const r = Engine.Airway(req.body || {}); res.json({ version: '3.30.0', module: 'anesthesia2', function: 'Airway', plan: r.plan }); })
  router.post('/call/Regional', (req, res) => { const r = Engine.Regional(req.body || {}); res.json({ version: '3.30.0', module: 'anesthesia2', function: 'Regional', plan: r.plan }); })
  router.post('/call/General', (req, res) => { const r = Engine.General(req.body || {}); res.json({ version: '3.30.0', module: 'anesthesia2', function: 'General', plan: r.plan }); })
  router.post('/call/Monitoring', (req, res) => { const r = Engine.Monitoring(req.body || {}); res.json({ version: '3.30.0', module: 'anesthesia2', function: 'Monitoring', plan: r.plan }); })
  router.post('/call/Pain', (req, res) => { const r = Engine.Pain(req.body || {}); res.json({ version: '3.30.0', module: 'anesthesia2', function: 'Pain', plan: r.plan }); })
  router.post('/call/Complications', (req, res) => { const r = Engine.Complications(req.body || {}); res.json({ version: '3.30.0', module: 'anesthesia2', function: 'Complications', plan: r.plan }); })
  router.post('/call/Fluids', (req, res) => { const r = Engine.Fluids(req.body || {}); res.json({ version: '3.30.0', module: 'anesthesia2', function: 'Fluids', plan: r.plan }); })
  router.post('/call/Emergence', (req, res) => { const r = Engine.Emergence(req.body || {}); res.json({ version: '3.30.0', module: 'anesthesia2', function: 'Emergence', plan: r.plan }); })
  router.post('/call/RegionalBlock', (req, res) => { const r = Engine.RegionalBlock(req.body || {}); res.json({ version: '3.30.0', module: 'anesthesia2', function: 'RegionalBlock', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.30.0', module: 'anesthesia2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
