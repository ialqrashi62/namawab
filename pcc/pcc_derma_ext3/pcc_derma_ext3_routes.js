// P3-CL pcc_derma_ext3 routes v3.50.0
// P3-CL: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_derma_ext3';
const F = require('./pcc_derma_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.50.0',
    module: 'pcc_derma_ext3',
    label: 'PCC Derma Ext3',
    functions: Object.keys(F),
  });
});
  router.post('/call/Lesion', (req, res) => { const r = F.Lesion(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Lesion', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Rash', (req, res) => { const r = F.Rash(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Rash', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Burn', (req, res) => { const r = F.Burn(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Burn', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Melanoma', (req, res) => { const r = F.Melanoma(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Melanoma', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Psoriasis', (req, res) => { const r = F.Psoriasis(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Psoriasis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Acne', (req, res) => { const r = F.Acne(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Acne', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Ulcer', (req, res) => { const r = F.Ulcer(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Ulcer', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Mohs', (req, res) => { const r = F.Mohs(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Mohs', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Dermoscopy', (req, res) => { const r = F.Dermoscopy(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Dermoscopy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Patch', (req, res) => { const r = F.Patch(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Patch', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
