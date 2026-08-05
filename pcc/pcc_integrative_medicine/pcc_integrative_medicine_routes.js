// P3-DA pcc_integrative_medicine routes v3.65.0
// P3-DA: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_integrative_medicine';
const F = require('./pcc_integrative_medicine_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.65.0',
    module: 'pcc_integrative_medicine',
    label: 'PCC Integrative Medicine',
    functions: Object.keys(F),
  });
});
  router.post('/call/HolisticAssessment', (req, res) => { const r = F.HolisticAssessment(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'HolisticAssessment', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/MindBody', (req, res) => { const r = F.MindBody(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'MindBody', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Acupuncture', (req, res) => { const r = F.Acupuncture(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'Acupuncture', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/HerbalMedicine', (req, res) => { const r = F.HerbalMedicine(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'HerbalMedicine', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/NutritionTherapy', (req, res) => { const r = F.NutritionTherapy(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'NutritionTherapy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/YogaTherapy', (req, res) => { const r = F.YogaTherapy(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'YogaTherapy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/StressReduction', (req, res) => { const r = F.StressReduction(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'StressReduction', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/SleepOptimization', (req, res) => { const r = F.SleepOptimization(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'SleepOptimization', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/DetoxProtocol', (req, res) => { const r = F.DetoxProtocol(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'DetoxProtocol', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/IntegrativeOncology', (req, res) => { const r = F.IntegrativeOncology(req.body || {}); res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: 'IntegrativeOncology', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.65.0', module: 'pcc_integrative_medicine', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
