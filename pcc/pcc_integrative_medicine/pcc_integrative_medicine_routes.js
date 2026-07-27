// P3-DA pcc_integrative_medicine routes v3.65.0
// P3-DA: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_integrative_medicine_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.65.0',
    module: 'pcc_integrative_medicine',
    label: 'PCC Integrative Medicine',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/HolisticAssessment', (req, res) => { const r = Engine.HolisticAssessment(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'HolisticAssessment', plan: r.plan }); })
  router.post('/call/MindBody', (req, res) => { const r = Engine.MindBody(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'MindBody', plan: r.plan }); })
  router.post('/call/Acupuncture', (req, res) => { const r = Engine.Acupuncture(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'Acupuncture', plan: r.plan }); })
  router.post('/call/HerbalMedicine', (req, res) => { const r = Engine.HerbalMedicine(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'HerbalMedicine', plan: r.plan }); })
  router.post('/call/NutritionTherapy', (req, res) => { const r = Engine.NutritionTherapy(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'NutritionTherapy', plan: r.plan }); })
  router.post('/call/YogaTherapy', (req, res) => { const r = Engine.YogaTherapy(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'YogaTherapy', plan: r.plan }); })
  router.post('/call/StressReduction', (req, res) => { const r = Engine.StressReduction(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'StressReduction', plan: r.plan }); })
  router.post('/call/SleepOptimization', (req, res) => { const r = Engine.SleepOptimization(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'SleepOptimization', plan: r.plan }); })
  router.post('/call/DetoxProtocol', (req, res) => { const r = Engine.DetoxProtocol(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'DetoxProtocol', plan: r.plan }); })
  router.post('/call/IntegrativeOncology', (req, res) => { const r = Engine.IntegrativeOncology(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'IntegrativeOncology', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
