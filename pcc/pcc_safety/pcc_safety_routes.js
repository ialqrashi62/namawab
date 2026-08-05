// P3-CR pcc_safety routes v3.56.0
// P3-CR: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_safety';
const F = require('./pcc_safety_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.56.0',
    module: 'pcc_safety',
    label: 'PCC Safety',
    functions: Object.keys(F),
  });
});
  router.post('/call/Fall', (req, res) => { const r = F.Fall(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'Fall', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Restraint', (req, res) => { const r = F.Restraint(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'Restraint', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Suicide', (req, res) => { const r = F.Suicide(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'Suicide', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Elopement', (req, res) => { const r = F.Elopement(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'Elopement', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Mislabel', (req, res) => { const r = F.Mislabel(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'Mislabel', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/WrongPt', (req, res) => { const r = F.WrongPt(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'WrongPt', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Fire', (req, res) => { const r = F.Fire(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'Fire', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Radiation', (req, res) => { const r = F.Radiation(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'Radiation', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Sharps', (req, res) => { const r = F.Sharps(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'Sharps', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Hazard', (req, res) => { const r = F.Hazard(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_safety', function: 'Hazard', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.56.0', module: 'pcc_safety', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
