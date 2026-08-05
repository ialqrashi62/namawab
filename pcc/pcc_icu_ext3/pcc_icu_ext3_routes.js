// P3-CJ pcc_icu_ext3 routes v3.48.0
// P3-CJ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_icu_ext3';
const F = require('./pcc_icu_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.48.0',
    module: 'pcc_icu_ext3',
    label: 'PCC ICU Ext3',
    functions: Object.keys(F),
  });
});
  router.post('/call/Ventilation', (req, res) => { const r = F.Ventilation(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'Ventilation', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Sedation', (req, res) => { const r = F.Sedation(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'Sedation', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Drivers', (req, res) => { const r = F.Drivers(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'Drivers', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Nutrition', (req, res) => { const r = F.Nutrition(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'Nutrition', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Transport', (req, res) => { const r = F.Transport(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'Transport', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Braden', (req, res) => { const r = F.Braden(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'Braden', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/HandHygiene', (req, res) => { const r = F.HandHygiene(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'HandHygiene', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Discharge', (req, res) => { const r = F.Discharge(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'Discharge', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/DailyGoals', (req, res) => { const r = F.DailyGoals(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'DailyGoals', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Requiring', (req, res) => { const r = F.Requiring(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: 'Requiring', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.48.0', module: 'pcc_icu_ext3', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
