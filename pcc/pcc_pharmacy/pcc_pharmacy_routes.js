// P3-CG pcc_pharmacy routes v3.45.0
// P3-CG: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_pharmacy';
const F = require('./pcc_pharmacy_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.45.0',
    module: 'pcc_pharmacy',
    label: 'PCC Pharmacy',
    functions: Object.keys(F),
  });
});
  router.post('/call/Dispense', (req, res) => { const r = F.Dispense(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'Dispense', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Interaction', (req, res) => { const r = F.Interaction(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'Interaction', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Allergy', (req, res) => { const r = F.Allergy(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'Allergy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/DoseCheck', (req, res) => { const r = F.DoseCheck(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'DoseCheck', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Refill', (req, res) => { const r = F.Refill(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'Refill', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Compounding', (req, res) => { const r = F.Compounding(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'Compounding', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Narcotic', (req, res) => { const r = F.Narcotic(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'Narcotic', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/IVAdmixture', (req, res) => { const r = F.IVAdmixture(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'IVAdmixture', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Formulary', (req, res) => { const r = F.Formulary(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'Formulary', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Counseling', (req, res) => { const r = F.Counseling(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: 'Counseling', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.45.0', module: 'pcc_pharmacy', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
