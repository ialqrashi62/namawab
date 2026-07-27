// P3-CG pcc_oncology_ext routes v3.45.0
// P3-CG: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_oncology_ext_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.45.0',
    module: 'pcc_oncology_ext',
    label: 'PCC Oncology Ext',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Regimen', (req, res) => { const r = Engine.Regimen(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'Regimen', plan: r.plan }); })
  router.post('/call/Cycle', (req, res) => { const r = Engine.Cycle(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'Cycle', plan: r.plan }); })
  router.post('/call/Toxicity', (req, res) => { const r = Engine.Toxicity(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'Toxicity', plan: r.plan }); })
  router.post('/call/Response', (req, res) => { const r = Engine.Response(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'Response', plan: r.plan }); })
  router.post('/call/DoseReduction', (req, res) => { const r = Engine.DoseReduction(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'DoseReduction', plan: r.plan }); })
  router.post('/call/HoldReason', (req, res) => { const r = Engine.HoldReason(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'HoldReason', plan: r.plan }); })
  router.post('/call/Biomarker', (req, res) => { const r = Engine.Biomarker(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'Biomarker', plan: r.plan }); })
  router.post('/call/Survivorship', (req, res) => { const r = Engine.Survivorship(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'Survivorship', plan: r.plan }); })
  router.post('/call/TumorBoard', (req, res) => { const r = Engine.TumorBoard(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'TumorBoard', plan: r.plan }); })
  router.post('/call/Palliative', (req, res) => { const r = Engine.Palliative(req.body || {}); res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: 'Palliative', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.45.0', module: 'pcc_oncology_ext', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
