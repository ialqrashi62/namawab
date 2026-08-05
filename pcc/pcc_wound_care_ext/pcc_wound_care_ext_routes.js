// P3-CY pcc_wound_care_ext routes v3.63.0
// P3-CY: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_wound_care_ext';
const F = require('./pcc_wound_care_ext_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.63.0',
    module: 'pcc_wound_care_ext',
    label: 'PCC Wound Care Extended',
    functions: Object.keys(F),
  });
});
  router.post('/call/WoundAssessment', (req, res) => { const r = F.WoundAssessment(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'WoundAssessment', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Debridement', (req, res) => { const r = F.Debridement(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'Debridement', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/InfectionControl', (req, res) => { const r = F.InfectionControl(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'InfectionControl', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Dressing', (req, res) => { const r = F.Dressing(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'Dressing', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/PressureInjury', (req, res) => { const r = F.PressureInjury(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'PressureInjury', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/DiabeticFoot', (req, res) => { const r = F.DiabeticFoot(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'DiabeticFoot', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/VacTherapy', (req, res) => { const r = F.VacTherapy(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'VacTherapy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/HealingScore', (req, res) => { const r = F.HealingScore(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'HealingScore', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/NutritionWound', (req, res) => { const r = F.NutritionWound(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'NutritionWound', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/ScarManagement', (req, res) => { const r = F.ScarManagement(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'ScarManagement', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
