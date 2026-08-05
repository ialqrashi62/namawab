// P3-CD pcc_emergency routes v3.42.0
// P3-CD: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_emergency';
const F = require('./pcc_emergency_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.42.0',
    module: 'pcc_emergency',
    label: 'PCC Emergency',
    functions: Object.keys(F),
  });
});
  router.post('/call/Triage', (req, res) => { const r = F.Triage(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'Triage', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Resus', (req, res) => { const r = F.Resus(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'Resus', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Trauma', (req, res) => { const r = F.Trauma(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'Trauma', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Sepsis', (req, res) => { const r = F.Sepsis(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'Sepsis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Stroke', (req, res) => { const r = F.Stroke(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'Stroke', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/MI', (req, res) => { const r = F.MI(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'MI', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Anaphylaxis', (req, res) => { const r = F.Anaphylaxis(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'Anaphylaxis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Toxicology', (req, res) => { const r = F.Toxicology(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'Toxicology', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Burn', (req, res) => { const r = F.Burn(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'Burn', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Disposition', (req, res) => { const r = F.Disposition(req.body || {}); res.json({ version: '3.42.0', module: 'pcc_emergency', function: 'Disposition', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.42.0', module: 'pcc_emergency', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
