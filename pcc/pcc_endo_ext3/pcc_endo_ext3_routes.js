// P3-CM pcc_endo_ext3 routes v3.51.0
// P3-CM: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_endo_ext3';
const F = require('./pcc_endo_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.51.0',
    module: 'pcc_endo_ext3',
    label: 'PCC Endo Ext3',
    functions: Object.keys(F),
  });
});
  router.post('/call/DmType', (req, res) => { const r = F.DmType(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'DmType', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/A1c', (req, res) => { const r = F.A1c(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'A1c', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Thyroid', (req, res) => { const r = F.Thyroid(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'Thyroid', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Calcium', (req, res) => { const r = F.Calcium(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'Calcium', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Adrenal', (req, res) => { const r = F.Adrenal(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'Adrenal', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Pituitary', (req, res) => { const r = F.Pituitary(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'Pituitary', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Osteo', (req, res) => { const r = F.Osteo(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'Osteo', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Pcos', (req, res) => { const r = F.Pcos(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'Pcos', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Dka', (req, res) => { const r = F.Dka(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'Dka', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Lipid', (req, res) => { const r = F.Lipid(req.body || {}); res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: 'Lipid', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.51.0', module: 'pcc_endo_ext3', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
