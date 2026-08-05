// P3-CY pcc_genetic_counseling routes v3.63.0
// P3-CY: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_genetic_counseling';
const F = require('./pcc_genetic_counseling_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.63.0',
    module: 'pcc_genetic_counseling',
    label: 'PCC Genetic Counseling',
    functions: Object.keys(F),
  });
});
  router.post('/call/RiskAssessment', (req, res) => { const r = F.RiskAssessment(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'RiskAssessment', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Pedigree', (req, res) => { const r = F.Pedigree(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'Pedigree', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/CarrierScreen', (req, res) => { const r = F.CarrierScreen(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'CarrierScreen', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/PrenatalTesting', (req, res) => { const r = F.PrenatalTesting(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'PrenatalTesting', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/CancerGenetics', (req, res) => { const r = F.CancerGenetics(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'CancerGenetics', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Pharmacogenomics', (req, res) => { const r = F.Pharmacogenomics(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'Pharmacogenomics', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/VariantInterpretation', (req, res) => { const r = F.VariantInterpretation(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'VariantInterpretation', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Consent', (req, res) => { const r = F.Consent(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'Consent', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/FamilyCommunication', (req, res) => { const r = F.FamilyCommunication(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'FamilyCommunication', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Referral', (req, res) => { const r = F.Referral(req.body || {}); res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: 'Referral', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.63.0', module: 'pcc_genetic_counseling', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
