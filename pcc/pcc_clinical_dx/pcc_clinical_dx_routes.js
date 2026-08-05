// P3-CC pcc_clinical_dx routes v3.41.0
// P3-CC: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_clinical_dx';
const F = require('./pcc_clinical_dx_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.41.0',
    module: 'pcc_clinical_dx',
    label: 'PCC Clinical DX',
    functions: Object.keys(F),
  });
});
  router.post('/call/Differential', (req, res) => { const r = F.Differential(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'Differential', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Workup', (req, res) => { const r = F.Workup(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'Workup', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Imaging', (req, res) => { const r = F.Imaging(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'Imaging', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Lab', (req, res) => { const r = F.Lab(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'Lab', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Consult', (req, res) => { const r = F.Consult(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'Consult', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Spec', (req, res) => { const r = F.Spec(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'Spec', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/FollowUp', (req, res) => { const r = F.FollowUp(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'FollowUp', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Disposition', (req, res) => { const r = F.Disposition(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'Disposition', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Pathway', (req, res) => { const r = F.Pathway(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'Pathway', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Alert', (req, res) => { const r = F.Alert(req.body || {}); res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: 'Alert', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.41.0', module: 'pcc_clinical_dx', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
