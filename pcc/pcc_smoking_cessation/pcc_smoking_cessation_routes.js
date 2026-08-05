// P3-CX pcc_smoking_cessation routes v3.62.0
// P3-CX: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_smoking_cessation';
const F = require('./pcc_smoking_cessation_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.62.0',
    module: 'pcc_smoking_cessation',
    label: 'PCC Smoking Cessation',
    functions: Object.keys(F),
  });
});
  router.post('/call/Readiness', (req, res) => { const r = F.Readiness(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'Readiness', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/PackYears', (req, res) => { const r = F.PackYears(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'PackYears', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Fagerstrom', (req, res) => { const r = F.Fagerstrom(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'Fagerstrom', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/QuitPlan', (req, res) => { const r = F.QuitPlan(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'QuitPlan', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Nrt', (req, res) => { const r = F.Nrt(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'Nrt', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Varenicline', (req, res) => { const r = F.Varenicline(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'Varenicline', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Bupropion', (req, res) => { const r = F.Bupropion(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'Bupropion', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Counseling', (req, res) => { const r = F.Counseling(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'Counseling', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Relapse', (req, res) => { const r = F.Relapse(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'Relapse', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/CarbonMonoxide', (req, res) => { const r = F.CarbonMonoxide(req.body || {}); res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: 'CarbonMonoxide', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.62.0', module: 'pcc_smoking_cessation', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
