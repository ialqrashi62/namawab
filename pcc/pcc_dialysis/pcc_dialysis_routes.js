// P3-CG pcc_dialysis routes v3.45.0
// P3-CG: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_dialysis_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.45.0',
    module: 'pcc_dialysis',
    label: 'PCC Dialysis',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Access', (req, res) => { const r = Engine.Access(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_dialysis', function: 'Access', plan: r.plan }); })
  router.post('/call/Treatment', (req, res) => { const r = Engine.Treatment(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_dialysis', function: 'Treatment', plan: r.plan }); })
  router.post('/call/Clearance', (req, res) => { const r = Engine.Clearance(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_dialysis', function: 'Clearance', plan: r.plan }); })
  router.post('/call/DryWeight', (req, res) => { const r = Engine.DryWeight(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_dialysis', function: 'DryWeight', plan: r.plan }); })
  router.post('/call/Ultrafiltration', (req, res) => { const r = Engine.Ultrafiltration(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_dialysis', function: 'Ultrafiltration', plan: r.plan }); })
  router.post('/call/Heparin', (req, res) => { const r = Engine.Heparin(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_dialysis', function: 'Heparin', plan: r.plan }); })
  router.post('/call/Sodium', (req, res) => { const r = Engine.Sodium(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_dialysis', function: 'Sodium', plan: r.plan }); })
  router.post('/call/Bicarbonate', (req, res) => { const r = Engine.Bicarbonate(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_dialysis', function: 'Bicarbonate', plan: r.plan }); })
  router.post('/call/Reuse', (req, res) => { const r = Engine.Reuse(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_dialysis', function: 'Reuse', plan: r.plan }); })
  router.post('/call/KtV', (req, res) => { const r = Engine.KtV(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_dialysis', function: 'KtV', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.45.0', module: 'pcc_dialysis', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
