// P3-CR pcc_safety routes v3.56.0
// P3-CR: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_safety_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.56.0',
    module: 'pcc_safety',
    label: 'PCC Safety',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Fall', (req, res) => { const r = Engine.Fall(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'Fall', plan: r.plan }); })
  router.post('/call/Restraint', (req, res) => { const r = Engine.Restraint(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'Restraint', plan: r.plan }); })
  router.post('/call/Suicide', (req, res) => { const r = Engine.Suicide(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'Suicide', plan: r.plan }); })
  router.post('/call/Elopement', (req, res) => { const r = Engine.Elopement(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'Elopement', plan: r.plan }); })
  router.post('/call/Mislabel', (req, res) => { const r = Engine.Mislabel(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'Mislabel', plan: r.plan }); })
  router.post('/call/WrongPt', (req, res) => { const r = Engine.WrongPt(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'WrongPt', plan: r.plan }); })
  router.post('/call/Fire', (req, res) => { const r = Engine.Fire(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'Fire', plan: r.plan }); })
  router.post('/call/Radiation', (req, res) => { const r = Engine.Radiation(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'Radiation', plan: r.plan }); })
  router.post('/call/Sharps', (req, res) => { const r = Engine.Sharps(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'Sharps', plan: r.plan }); })
  router.post('/call/Hazard', (req, res) => { const r = Engine.Hazard(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'Hazard', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.56.0', module: 'pcc_safety', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
