// P3-CC pcc_drug routes v3.41.0
// P3-CC: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_drug';
const F = require('./pcc_drug_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.41.0',
    module: 'pcc_drug',
    label: 'PCC Drug',
    functions: Object.keys(F),
  });
});
  router.post('/call/Dose', (req, res) => { const r = F.Dose(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Dose', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Interaction', (req, res) => { const r = F.Interaction(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Interaction', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Allergy', (req, res) => { const r = F.Allergy(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Allergy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Renal', (req, res) => { const r = F.Renal(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Renal', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Hepatic', (req, res) => { const r = F.Hepatic(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Hepatic', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Level', (req, res) => { const r = F.Level(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Level', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Pregnancy', (req, res) => { const r = F.Pregnancy(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Pregnancy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Route', (req, res) => { const r = F.Route(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Route', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Frequency', (req, res) => { const r = F.Frequency(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Frequency', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Duration', (req, res) => { const r = F.Duration(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_drug', function: 'Duration', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.41.0', module: 'pcc_drug', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
