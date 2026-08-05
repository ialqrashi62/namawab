// P3-DA pcc_functional_medicine routes v3.65.0
// P3-DA: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_functional_medicine';
const F = require('./pcc_functional_medicine_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.65.0',
    module: 'pcc_functional_medicine',
    label: 'PCC Functional Medicine',
    functions: Object.keys(F),
  });
});
  router.post('/call/RootCause', (req, res) => { const r = F.RootCause(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'RootCause', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Timeline', (req, res) => { const r = F.Timeline(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'Timeline', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/EliminationDiet', (req, res) => { const r = F.EliminationDiet(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'EliminationDiet', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/GutHealing', (req, res) => { const r = F.GutHealing(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'GutHealing', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/HormoneBalance', (req, res) => { const r = F.HormoneBalance(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'HormoneBalance', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Toxicity', (req, res) => { const r = F.Toxicity(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'Toxicity', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Inflammation', (req, res) => { const r = F.Inflammation(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'Inflammation', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/MitochondrialSupport', (req, res) => { const r = F.MitochondrialSupport(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'MitochondrialSupport', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/ImmuneModulation', (req, res) => { const r = F.ImmuneModulation(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'ImmuneModulation', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/PersonalizedPlan', (req, res) => { const r = F.PersonalizedPlan(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: 'PersonalizedPlan', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.65.0', module: 'pcc_functional_medicine', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
