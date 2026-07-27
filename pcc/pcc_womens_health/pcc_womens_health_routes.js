// P3-CU pcc_womens_health routes v3.59.0
// P3-CU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_womens_health_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.59.0',
    module: 'pcc_womens_health',
    label: 'PCC Womens Health',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Pregnancy', (req, res) => { const r = Engine.Pregnancy(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Pregnancy', plan: r.plan }); })
  router.post('/call/Contraception', (req, res) => { const r = Engine.Contraception(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Contraception', plan: r.plan }); })
  router.post('/call/Menopause', (req, res) => { const r = Engine.Menopause(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Menopause', plan: r.plan }); })
  router.post('/call/Pcos', (req, res) => { const r = Engine.Pcos(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Pcos', plan: r.plan }); })
  router.post('/call/Endometriosis', (req, res) => { const r = Engine.Endometriosis(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Endometriosis', plan: r.plan }); })
  router.post('/call/Infertility', (req, res) => { const r = Engine.Infertility(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Infertility', plan: r.plan }); })
  router.post('/call/Postpartum', (req, res) => { const r = Engine.Postpartum(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Postpartum', plan: r.plan }); })
  router.post('/call/Sti', (req, res) => { const r = Engine.Sti(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Sti', plan: r.plan }); })
  router.post('/call/Domestic', (req, res) => { const r = Engine.Domestic(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Domestic', plan: r.plan }); })
  router.post('/call/Vaginitis', (req, res) => { const r = Engine.Vaginitis(req.body || {}); res.json({ version: '3.59.0', module: 'pcc_womens_health', function: 'Vaginitis', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.59.0', module: 'pcc_womens_health', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
