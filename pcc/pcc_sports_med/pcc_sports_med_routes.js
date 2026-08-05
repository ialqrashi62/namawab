// P3-CV pcc_sports_med routes v3.60.0
// P3-CV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_sports_med';
const F = require('./pcc_sports_med_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.60.0',
    module: 'pcc_sports_med',
    label: 'PCC Sports Medicine',
    functions: Object.keys(F),
  });
});
  router.post('/call/Injury', (req, res) => { const r = F.Injury(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'Injury', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/ReturnToPlay', (req, res) => { const r = F.ReturnToPlay(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'ReturnToPlay', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Concussion', (req, res) => { const r = F.Concussion(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'Concussion', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/CardiacScreen', (req, res) => { const r = F.CardiacScreen(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'CardiacScreen', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Hydration', (req, res) => { const r = F.Hydration(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'Hydration', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Heat', (req, res) => { const r = F.Heat(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'Heat', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Overuse', (req, res) => { const r = F.Overuse(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'Overuse', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Doping', (req, res) => { const r = F.Doping(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'Doping', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Nutrition', (req, res) => { const r = F.Nutrition(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'Nutrition', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Imaging', (req, res) => { const r = F.Imaging(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_sports_med', function: 'Imaging', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.60.0', module: 'pcc_sports_med', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
