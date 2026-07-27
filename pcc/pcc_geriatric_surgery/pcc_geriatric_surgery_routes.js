// P3-CZ pcc_geriatric_surgery routes v3.64.0
// P3-CZ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_geriatric_surgery_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.64.0',
    module: 'pcc_geriatric_surgery',
    label: 'PCC Geriatric Surgery',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/FrailtyIndex', (req, res) => { const r = Engine.FrailtyIndex(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'FrailtyIndex', plan: r.plan }); })
  router.post('/call/Prehabilitation', (req, res) => { const r = Engine.Prehabilitation(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'Prehabilitation', plan: r.plan }); })
  router.post('/call/DeliriumRisk', (req, res) => { const r = Engine.DeliriumRisk(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'DeliriumRisk', plan: r.plan }); })
  router.post('/call/NutritionScreen', (req, res) => { const r = Engine.NutritionScreen(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'NutritionScreen', plan: r.plan }); })
  router.post('/call/Polypharmacy', (req, res) => { const r = Engine.Polypharmacy(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'Polypharmacy', plan: r.plan }); })
  router.post('/call/MobilityPlan', (req, res) => { const r = Engine.MobilityPlan(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'MobilityPlan', plan: r.plan }); })
  router.post('/call/DischargeDestination', (req, res) => { const r = Engine.DischargeDestination(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'DischargeDestination', plan: r.plan }); })
  router.post('/call/ComplicationRisk', (req, res) => { const r = Engine.ComplicationRisk(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'ComplicationRisk', plan: r.plan }); })
  router.post('/call/PalliativeTalk', (req, res) => { const r = Engine.PalliativeTalk(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'PalliativeTalk', plan: r.plan }); })
  router.post('/call/FollowUp', (req, res) => { const r = Engine.FollowUp(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'FollowUp', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
