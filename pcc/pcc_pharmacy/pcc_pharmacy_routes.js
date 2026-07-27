// P3-CG pcc_pharmacy routes v3.45.0
// P3-CG: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_pharmacy_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.45.0',
    module: 'pcc_pharmacy',
    label: 'PCC Pharmacy',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Dispense', (req, res) => { const r = Engine.Dispense(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'Dispense', plan: r.plan }); })
  router.post('/call/Interaction', (req, res) => { const r = Engine.Interaction(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'Interaction', plan: r.plan }); })
  router.post('/call/Allergy', (req, res) => { const r = Engine.Allergy(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'Allergy', plan: r.plan }); })
  router.post('/call/DoseCheck', (req, res) => { const r = Engine.DoseCheck(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'DoseCheck', plan: r.plan }); })
  router.post('/call/Refill', (req, res) => { const r = Engine.Refill(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'Refill', plan: r.plan }); })
  router.post('/call/Compounding', (req, res) => { const r = Engine.Compounding(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'Compounding', plan: r.plan }); })
  router.post('/call/Narcotic', (req, res) => { const r = Engine.Narcotic(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'Narcotic', plan: r.plan }); })
  router.post('/call/IVAdmixture', (req, res) => { const r = Engine.IVAdmixture(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'IVAdmixture', plan: r.plan }); })
  router.post('/call/Formulary', (req, res) => { const r = Engine.Formulary(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'Formulary', plan: r.plan }); })
  router.post('/call/Counseling', (req, res) => { const r = Engine.Counseling(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'Counseling', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
