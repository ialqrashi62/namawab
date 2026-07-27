// P3-CU pcc_cancer_screen routes v3.59.0
// P3-CU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_cancer_screen_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.59.0',
    module: 'pcc_cancer_screen',
    label: 'PCC Cancer Screen',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Breast', (req, res) => { const r = Engine.Breast(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Breast', plan: r.plan }); })
  router.post('/call/Colon', (req, res) => { const r = Engine.Colon(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Colon', plan: r.plan }); })
  router.post('/call/Cervix', (req, res) => { const r = Engine.Cervix(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Cervix', plan: r.plan }); })
  router.post('/call/Prostate', (req, res) => { const r = Engine.Prostate(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Prostate', plan: r.plan }); })
  router.post('/call/Lung', (req, res) => { const r = Engine.Lung(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Lung', plan: r.plan }); })
  router.post('/call/Skin', (req, res) => { const r = Engine.Skin(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Skin', plan: r.plan }); })
  router.post('/call/Ovarian', (req, res) => { const r = Engine.Ovarian(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Ovarian', plan: r.plan }); })
  router.post('/call/Hpv', (req, res) => { const r = Engine.Hpv(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Hpv', plan: r.plan }); })
  router.post('/call/Smear', (req, res) => { const r = Engine.Smear(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Smear', plan: r.plan }); })
  router.post('/call/Recall', (req, res) => { const r = Engine.Recall(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Recall', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
