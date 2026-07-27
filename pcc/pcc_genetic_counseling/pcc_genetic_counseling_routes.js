// P3-CY pcc_genetic_counseling routes v3.63.0
// P3-CY: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_genetic_counseling_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.63.0',
    module: 'pcc_genetic_counseling',
    label: 'PCC Genetic Counseling',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/RiskAssessment', (req, res) => { const r = Engine.RiskAssessment(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'RiskAssessment', plan: r.plan }); })
  router.post('/call/Pedigree', (req, res) => { const r = Engine.Pedigree(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'Pedigree', plan: r.plan }); })
  router.post('/call/CarrierScreen', (req, res) => { const r = Engine.CarrierScreen(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'CarrierScreen', plan: r.plan }); })
  router.post('/call/PrenatalTesting', (req, res) => { const r = Engine.PrenatalTesting(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'PrenatalTesting', plan: r.plan }); })
  router.post('/call/CancerGenetics', (req, res) => { const r = Engine.CancerGenetics(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'CancerGenetics', plan: r.plan }); })
  router.post('/call/Pharmacogenomics', (req, res) => { const r = Engine.Pharmacogenomics(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'Pharmacogenomics', plan: r.plan }); })
  router.post('/call/VariantInterpretation', (req, res) => { const r = Engine.VariantInterpretation(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'VariantInterpretation', plan: r.plan }); })
  router.post('/call/Consent', (req, res) => { const r = Engine.Consent(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'Consent', plan: r.plan }); })
  router.post('/call/FamilyCommunication', (req, res) => { const r = Engine.FamilyCommunication(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'FamilyCommunication', plan: r.plan }); })
  router.post('/call/Referral', (req, res) => { const r = Engine.Referral(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'Referral', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
