// P3-CW pcc_allergy_immunology routes v3.61.0
// P3-CW: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_allergy_immunology';
const F = require('./pcc_allergy_immunology_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.61.0',
    module: 'pcc_allergy_immunology',
    label: 'PCC Allergy Immunology',
    functions: Object.keys(F),
  });
});
  router.post('/call/Ige', (req, res) => { const r = F.Ige(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'Ige', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/SkinTest', (req, res) => { const r = F.SkinTest(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'SkinTest', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Anaphylaxis', (req, res) => { const r = F.Anaphylaxis(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'Anaphylaxis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Desensitization', (req, res) => { const r = F.Desensitization(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'Desensitization', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/FoodAllergy', (req, res) => { const r = F.FoodAllergy(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'FoodAllergy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/DrugAllergy', (req, res) => { const r = F.DrugAllergy(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'DrugAllergy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/InsectAllergy', (req, res) => { const r = F.InsectAllergy(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'InsectAllergy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/AsthmaAllergy', (req, res) => { const r = F.AsthmaAllergy(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'AsthmaAllergy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Immunodeficiency', (req, res) => { const r = F.Immunodeficiency(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'Immunodeficiency', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Biologic', (req, res) => { const r = F.Biologic(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'Biologic', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
