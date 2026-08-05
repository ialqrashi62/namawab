// P3-CW pcc_occupational_health routes v3.61.0
// P3-CW: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_occupational_health';
const F = require('./pcc_occupational_health_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.61.0',
    module: 'pcc_occupational_health',
    label: 'PCC Occupational Health',
    functions: Object.keys(F),
  });
});
  router.post('/call/Fitness', (req, res) => { const r = F.Fitness(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'Fitness', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Exposure', (req, res) => { const r = F.Exposure(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'Exposure', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Vaccination', (req, res) => { const r = F.Vaccination(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'Vaccination', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Injury', (req, res) => { const r = F.Injury(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'Injury', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/ReturnToWork', (req, res) => { const r = F.ReturnToWork(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'ReturnToWork', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Hearing', (req, res) => { const r = F.Hearing(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'Hearing', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Vision', (req, res) => { const r = F.Vision(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'Vision', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Respiratory', (req, res) => { const r = F.Respiratory(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'Respiratory', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Chemical', (req, res) => { const r = F.Chemical(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'Chemical', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Ergonomics', (req, res) => { const r = F.Ergonomics(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: 'Ergonomics', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.61.0', module: 'pcc_occupational_health', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
