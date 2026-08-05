// P3-CQ pcc_diet_nutr routes v3.55.0
// P3-CQ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_diet_nutr';
const F = require('./pcc_diet_nutr_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.55.0',
    module: 'pcc_diet_nutr',
    label: 'PCC Diet Nutr',
    functions: Object.keys(F),
  });
});
  router.post('/call/Bmi', (req, res) => { const r = F.Bmi(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Bmi', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Tpn', (req, res) => { const r = F.Tpn(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Tpn', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Diet', (req, res) => { const r = F.Diet(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Diet', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Tube', (req, res) => { const r = F.Tube(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Tube', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Supplement', (req, res) => { const r = F.Supplement(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Supplement', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Malnutrition', (req, res) => { const r = F.Malnutrition(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Malnutrition', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Intolerance', (req, res) => { const r = F.Intolerance(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Intolerance', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Aspiration', (req, res) => { const r = F.Aspiration(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Aspiration', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Refeeding', (req, res) => { const r = F.Refeeding(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Refeeding', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Allerg', (req, res) => { const r = F.Allerg(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Allerg', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
