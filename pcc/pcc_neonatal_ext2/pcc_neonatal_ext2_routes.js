// P3-CK pcc_neonatal_ext2 routes v3.49.0
// P3-CK: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_neonatal_ext2';
const F = require('./pcc_neonatal_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.49.0',
    module: 'pcc_neonatal_ext2',
    label: 'PCC Neonatal Ext2',
    functions: Object.keys(F),
  });
});
  router.post('/call/GestationAge', (req, res) => { const r = F.GestationAge(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'GestationAge', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/APGAR', (req, res) => { const r = F.APGAR(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'APGAR', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/BirthWeight', (req, res) => { const r = F.BirthWeight(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'BirthWeight', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/NewbornScreen', (req, res) => { const r = F.NewbornScreen(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'NewbornScreen', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Breastfeed', (req, res) => { const r = F.Breastfeed(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'Breastfeed', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Hyperbilirubin', (req, res) => { const r = F.Hyperbilirubin(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'Hyperbilirubin', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Feeding', (req, res) => { const r = F.Feeding(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'Feeding', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/DischargeChecklist', (req, res) => { const r = F.DischargeChecklist(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'DischargeChecklist', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/SepsisEval', (req, res) => { const r = F.SepsisEval(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'SepsisEval', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/CordCare', (req, res) => { const r = F.CordCare(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'CordCare', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
