// P3-CU pcc_cancer_screen routes v3.59.0
// P3-CU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_cancer_screen';
const F = require('./pcc_cancer_screen_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.59.0',
    module: 'pcc_cancer_screen',
    label: 'PCC Cancer Screen',
    functions: Object.keys(F),
  });
});
  router.post('/call/Breast', (req, res) => { const r = F.Breast(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Breast', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Colon', (req, res) => { const r = F.Colon(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Colon', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Cervix', (req, res) => { const r = F.Cervix(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Cervix', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Prostate', (req, res) => { const r = F.Prostate(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Prostate', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Lung', (req, res) => { const r = F.Lung(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Lung', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Skin', (req, res) => { const r = F.Skin(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Skin', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Ovarian', (req, res) => { const r = F.Ovarian(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Ovarian', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Hpv', (req, res) => { const r = F.Hpv(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Hpv', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Smear', (req, res) => { const r = F.Smear(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Smear', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Recall', (req, res) => { const r = F.Recall(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: 'Recall', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.59.0', module: 'pcc_cancer_screen', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
