// P3-CZ pcc_geriatric_surgery routes v3.64.0
// P3-CZ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_geriatric_surgery';
const F = require('./pcc_geriatric_surgery_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.64.0',
    module: 'pcc_geriatric_surgery',
    label: 'PCC Geriatric Surgery',
    functions: Object.keys(F),
  });
});
  router.post('/call/FrailtyIndex', (req, res) => { const r = F.FrailtyIndex(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'FrailtyIndex', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Prehabilitation', (req, res) => { const r = F.Prehabilitation(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'Prehabilitation', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/DeliriumRisk', (req, res) => { const r = F.DeliriumRisk(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'DeliriumRisk', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/NutritionScreen', (req, res) => { const r = F.NutritionScreen(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'NutritionScreen', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Polypharmacy', (req, res) => { const r = F.Polypharmacy(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'Polypharmacy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/MobilityPlan', (req, res) => { const r = F.MobilityPlan(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'MobilityPlan', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/DischargeDestination', (req, res) => { const r = F.DischargeDestination(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'DischargeDestination', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/ComplicationRisk', (req, res) => { const r = F.ComplicationRisk(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'ComplicationRisk', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/PalliativeTalk', (req, res) => { const r = F.PalliativeTalk(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'PalliativeTalk', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/FollowUp', (req, res) => { const r = F.FollowUp(req.body || {}); res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: 'FollowUp', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.64.0', module: 'pcc_geriatric_surgery', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
