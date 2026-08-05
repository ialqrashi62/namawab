// P3-CU pcc_womens_health routes v3.59.0
// P3-CU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_womens_health';
const F = require('./pcc_womens_health_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.59.0',
    module: 'pcc_womens_health',
    label: 'PCC Womens Health',
    functions: Object.keys(F),
  });
});
  router.post('/call/Pregnancy', (req, res) => { const r = F.Pregnancy(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Pregnancy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Contraception', (req, res) => { const r = F.Contraception(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Contraception', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Menopause', (req, res) => { const r = F.Menopause(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Menopause', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Pcos', (req, res) => { const r = F.Pcos(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Pcos', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Endometriosis', (req, res) => { const r = F.Endometriosis(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Endometriosis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Infertility', (req, res) => { const r = F.Infertility(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Infertility', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Postpartum', (req, res) => { const r = F.Postpartum(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Postpartum', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Sti', (req, res) => { const r = F.Sti(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Sti', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Domestic', (req, res) => { const r = F.Domestic(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Domestic', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Vaginitis', (req, res) => { const r = F.Vaginitis(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Vaginitis', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.59.0', module: 'pcc_womens_health', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
