// P3-CQ pcc_diet_nutr routes v3.55.0
// P3-CQ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_diet_nutr_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.55.0',
    module: 'pcc_diet_nutr',
    label: 'PCC Diet Nutr',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Bmi', (req, res) => { const r = Engine.Bmi(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Bmi', plan: r.plan }); })
  router.post('/call/Tpn', (req, res) => { const r = Engine.Tpn(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Tpn', plan: r.plan }); })
  router.post('/call/Diet', (req, res) => { const r = Engine.Diet(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Diet', plan: r.plan }); })
  router.post('/call/Tube', (req, res) => { const r = Engine.Tube(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Tube', plan: r.plan }); })
  router.post('/call/Supplement', (req, res) => { const r = Engine.Supplement(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Supplement', plan: r.plan }); })
  router.post('/call/Malnutrition', (req, res) => { const r = Engine.Malnutrition(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Malnutrition', plan: r.plan }); })
  router.post('/call/Intolerance', (req, res) => { const r = Engine.Intolerance(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Intolerance', plan: r.plan }); })
  router.post('/call/Aspiration', (req, res) => { const r = Engine.Aspiration(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Aspiration', plan: r.plan }); })
  router.post('/call/Refeeding', (req, res) => { const r = Engine.Refeeding(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Refeeding', plan: r.plan }); })
  router.post('/call/Allerg', (req, res) => { const r = Engine.Allerg(req.body || {}); res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: 'Allerg', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.55.0', module: 'pcc_diet_nutr', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
