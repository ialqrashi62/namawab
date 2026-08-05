// P3-CV pcc_pain_mgmt routes v3.60.0
// P3-CV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_pain_mgmt';
const F = require('./pcc_pain_mgmt_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.60.0',
    module: 'pcc_pain_mgmt',
    label: 'PCC Pain Management',
    functions: Object.keys(F),
  });
});
  router.post('/call/Nrs', (req, res) => { const r = F.Nrs(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'Nrs', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/OpioidRisk', (req, res) => { const r = F.OpioidRisk(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'OpioidRisk', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Adjuvant', (req, res) => { const r = F.Adjuvant(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'Adjuvant', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Breakthrough', (req, res) => { const r = F.Breakthrough(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'Breakthrough', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Bowel', (req, res) => { const r = F.Bowel(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'Bowel', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Sedation', (req, res) => { const r = F.Sedation(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'Sedation', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Nausea', (req, res) => { const r = F.Nausea(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'Nausea', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Itch', (req, res) => { const r = F.Itch(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'Itch', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Respiratory', (req, res) => { const r = F.Respiratory(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'Respiratory', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Urinary', (req, res) => { const r = F.Urinary(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'Urinary', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
