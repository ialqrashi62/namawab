// P3-CG pcc_oncology_ext routes v3.45.0
// P3-CG: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_oncology_ext';
const F = require('./pcc_oncology_ext_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.45.0',
    module: 'pcc_oncology_ext',
    label: 'PCC Oncology Ext',
    functions: Object.keys(F),
  });
});
  router.post('/call/Regimen', (req, res) => { const r = F.Regimen(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'Regimen', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Cycle', (req, res) => { const r = F.Cycle(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'Cycle', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Toxicity', (req, res) => { const r = F.Toxicity(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'Toxicity', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Response', (req, res) => { const r = F.Response(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'Response', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/DoseReduction', (req, res) => { const r = F.DoseReduction(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'DoseReduction', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/HoldReason', (req, res) => { const r = F.HoldReason(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'HoldReason', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Biomarker', (req, res) => { const r = F.Biomarker(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'Biomarker', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Survivorship', (req, res) => { const r = F.Survivorship(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'Survivorship', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/TumorBoard', (req, res) => { const r = F.TumorBoard(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'TumorBoard', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Palliative', (req, res) => { const r = F.Palliative(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'Palliative', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
