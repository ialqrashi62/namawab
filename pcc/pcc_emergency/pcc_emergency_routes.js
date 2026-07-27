// P3-CD pcc_emergency routes v3.42.0
// P3-CD: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_emergency_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.42.0',
    module: 'pcc_emergency',
    label: 'PCC Emergency',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Triage', (req, res) => { const r = Engine.Triage(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'Triage', plan: r.plan }); })
  router.post('/call/Resus', (req, res) => { const r = Engine.Resus(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'Resus', plan: r.plan }); })
  router.post('/call/Trauma', (req, res) => { const r = Engine.Trauma(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'Trauma', plan: r.plan }); })
  router.post('/call/Sepsis', (req, res) => { const r = Engine.Sepsis(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'Sepsis', plan: r.plan }); })
  router.post('/call/Stroke', (req, res) => { const r = Engine.Stroke(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'Stroke', plan: r.plan }); })
  router.post('/call/MI', (req, res) => { const r = Engine.MI(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'MI', plan: r.plan }); })
  router.post('/call/Anaphylaxis', (req, res) => { const r = Engine.Anaphylaxis(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'Anaphylaxis', plan: r.plan }); })
  router.post('/call/Toxicology', (req, res) => { const r = Engine.Toxicology(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'Toxicology', plan: r.plan }); })
  router.post('/call/Burn', (req, res) => { const r = Engine.Burn(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'Burn', plan: r.plan }); })
  router.post('/call/Disposition', (req, res) => { const r = Engine.Disposition(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'Disposition', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.42.0', module: 'pcc_emergency', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
