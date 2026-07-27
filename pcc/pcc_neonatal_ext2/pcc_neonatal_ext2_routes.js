// P3-CK pcc_neonatal_ext2 routes v3.49.0
// P3-CK: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_neonatal_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.49.0',
    module: 'pcc_neonatal_ext2',
    label: 'PCC Neonatal Ext2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/GestationAge', (req, res) => { const r = Engine.GestationAge(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'GestationAge', plan: r.plan }); })
  router.post('/call/APGAR', (req, res) => { const r = Engine.APGAR(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'APGAR', plan: r.plan }); })
  router.post('/call/BirthWeight', (req, res) => { const r = Engine.BirthWeight(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'BirthWeight', plan: r.plan }); })
  router.post('/call/NewbornScreen', (req, res) => { const r = Engine.NewbornScreen(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'NewbornScreen', plan: r.plan }); })
  router.post('/call/Breastfeed', (req, res) => { const r = Engine.Breastfeed(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'Breastfeed', plan: r.plan }); })
  router.post('/call/Hyperbilirubin', (req, res) => { const r = Engine.Hyperbilirubin(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'Hyperbilirubin', plan: r.plan }); })
  router.post('/call/Feeding', (req, res) => { const r = Engine.Feeding(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'Feeding', plan: r.plan }); })
  router.post('/call/DischargeChecklist', (req, res) => { const r = Engine.DischargeChecklist(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'DischargeChecklist', plan: r.plan }); })
  router.post('/call/SepsisEval', (req, res) => { const r = Engine.SepsisEval(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'SepsisEval', plan: r.plan }); })
  router.post('/call/CordCare', (req, res) => { const r = Engine.CordCare(req.body || {}); res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: 'CordCare', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.49.0', module: 'pcc_neonatal_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
