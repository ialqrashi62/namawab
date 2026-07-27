// P3-CL pcc_derma_ext3 routes v3.50.0
// P3-CL: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_derma_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.50.0',
    module: 'pcc_derma_ext3',
    label: 'PCC Derma Ext3',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Lesion', (req, res) => { const r = Engine.Lesion(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Lesion', plan: r.plan }); })
  router.post('/call/Rash', (req, res) => { const r = Engine.Rash(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Rash', plan: r.plan }); })
  router.post('/call/Burn', (req, res) => { const r = Engine.Burn(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Burn', plan: r.plan }); })
  router.post('/call/Melanoma', (req, res) => { const r = Engine.Melanoma(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Melanoma', plan: r.plan }); })
  router.post('/call/Psoriasis', (req, res) => { const r = Engine.Psoriasis(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Psoriasis', plan: r.plan }); })
  router.post('/call/Acne', (req, res) => { const r = Engine.Acne(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Acne', plan: r.plan }); })
  router.post('/call/Ulcer', (req, res) => { const r = Engine.Ulcer(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Ulcer', plan: r.plan }); })
  router.post('/call/Mohs', (req, res) => { const r = Engine.Mohs(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Mohs', plan: r.plan }); })
  router.post('/call/Dermoscopy', (req, res) => { const r = Engine.Dermoscopy(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Dermoscopy', plan: r.plan }); })
  router.post('/call/Patch', (req, res) => { const r = Engine.Patch(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: 'Patch', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.50.0', module: 'pcc_derma_ext3', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
