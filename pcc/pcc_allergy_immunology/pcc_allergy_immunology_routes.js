// P3-CW pcc_allergy_immunology routes v3.61.0
// P3-CW: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_allergy_immunology_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.61.0',
    module: 'pcc_allergy_immunology',
    label: 'PCC Allergy Immunology',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Ige', (req, res) => { const r = Engine.Ige(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'Ige', plan: r.plan }); })
  router.post('/call/SkinTest', (req, res) => { const r = Engine.SkinTest(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'SkinTest', plan: r.plan }); })
  router.post('/call/Anaphylaxis', (req, res) => { const r = Engine.Anaphylaxis(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'Anaphylaxis', plan: r.plan }); })
  router.post('/call/Desensitization', (req, res) => { const r = Engine.Desensitization(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'Desensitization', plan: r.plan }); })
  router.post('/call/FoodAllergy', (req, res) => { const r = Engine.FoodAllergy(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'FoodAllergy', plan: r.plan }); })
  router.post('/call/DrugAllergy', (req, res) => { const r = Engine.DrugAllergy(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'DrugAllergy', plan: r.plan }); })
  router.post('/call/InsectAllergy', (req, res) => { const r = Engine.InsectAllergy(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'InsectAllergy', plan: r.plan }); })
  router.post('/call/AsthmaAllergy', (req, res) => { const r = Engine.AsthmaAllergy(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'AsthmaAllergy', plan: r.plan }); })
  router.post('/call/Immunodeficiency', (req, res) => { const r = Engine.Immunodeficiency(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'Immunodeficiency', plan: r.plan }); })
  router.post('/call/Biologic', (req, res) => { const r = Engine.Biologic(req.body || {}); res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: 'Biologic', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.61.0', module: 'pcc_allergy_immunology', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
