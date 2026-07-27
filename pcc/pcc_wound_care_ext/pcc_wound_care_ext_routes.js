// P3-CY pcc_wound_care_ext routes v3.63.0
// P3-CY: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_wound_care_ext_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.63.0',
    module: 'pcc_wound_care_ext',
    label: 'PCC Wound Care Extended',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/WoundAssessment', (req, res) => { const r = Engine.WoundAssessment(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'WoundAssessment', plan: r.plan }); })
  router.post('/call/Debridement', (req, res) => { const r = Engine.Debridement(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'Debridement', plan: r.plan }); })
  router.post('/call/InfectionControl', (req, res) => { const r = Engine.InfectionControl(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'InfectionControl', plan: r.plan }); })
  router.post('/call/Dressing', (req, res) => { const r = Engine.Dressing(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'Dressing', plan: r.plan }); })
  router.post('/call/PressureInjury', (req, res) => { const r = Engine.PressureInjury(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'PressureInjury', plan: r.plan }); })
  router.post('/call/DiabeticFoot', (req, res) => { const r = Engine.DiabeticFoot(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'DiabeticFoot', plan: r.plan }); })
  router.post('/call/VacTherapy', (req, res) => { const r = Engine.VacTherapy(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'VacTherapy', plan: r.plan }); })
  router.post('/call/HealingScore', (req, res) => { const r = Engine.HealingScore(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'HealingScore', plan: r.plan }); })
  router.post('/call/NutritionWound', (req, res) => { const r = Engine.NutritionWound(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'NutritionWound', plan: r.plan }); })
  router.post('/call/ScarManagement', (req, res) => { const r = Engine.ScarManagement(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: 'ScarManagement', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.63.0', module: 'pcc_wound_care_ext', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
