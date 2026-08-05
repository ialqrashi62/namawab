// pcc_pediatric_neuro_ext44 routes v3.154.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricNeurometabolicExt3, PediatricLeukodystrophyExt, PediatricMetachromaticLeukodystrophyExt, PediatricKrabbeDiseaseExt, PediatricAdrenoleukodystrophyExt, PediatricCanavanDiseaseExt, PediatricAlexanderDiseaseExt, PediatricPelizaeusMerzbacherExt, PediatricCerebralCholesterolinosisExt, PediatricVanishingWhiteMatterExt } = require('./pcc_pediatric_neuro_ext44_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.154.0', module: 'pcc_pediatric_neuro_ext44', label: 'PCC Pediatric Neuro Ext44', functions: ['PediatricNeurometabolicExt3', 'PediatricLeukodystrophyExt', 'PediatricMetachromaticLeukodystrophyExt', 'PediatricKrabbeDiseaseExt', 'PediatricAdrenoleukodystrophyExt', 'PediatricCanavanDiseaseExt', 'PediatricAlexanderDiseaseExt', 'PediatricPelizaeusMerzbacherExt', 'PediatricCerebralCholesterolinosisExt', 'PediatricVanishingWhiteMatterExt'] });
});
router.post('/call/PediatricNeurometabolicExt3', authenticate, (req, res) => {
  res.json(PediatricNeurometabolicExt3(req.body));
});

router.post('/call/PediatricLeukodystrophyExt', authenticate, (req, res) => {
  res.json(PediatricLeukodystrophyExt(req.body));
});

router.post('/call/PediatricMetachromaticLeukodystrophyExt', authenticate, (req, res) => {
  res.json(PediatricMetachromaticLeukodystrophyExt(req.body));
});

router.post('/call/PediatricKrabbeDiseaseExt', authenticate, (req, res) => {
  res.json(PediatricKrabbeDiseaseExt(req.body));
});

router.post('/call/PediatricAdrenoleukodystrophyExt', authenticate, (req, res) => {
  res.json(PediatricAdrenoleukodystrophyExt(req.body));
});

router.post('/call/PediatricCanavanDiseaseExt', authenticate, (req, res) => {
  res.json(PediatricCanavanDiseaseExt(req.body));
});

router.post('/call/PediatricAlexanderDiseaseExt', authenticate, (req, res) => {
  res.json(PediatricAlexanderDiseaseExt(req.body));
});

router.post('/call/PediatricPelizaeusMerzbacherExt', authenticate, (req, res) => {
  res.json(PediatricPelizaeusMerzbacherExt(req.body));
});

router.post('/call/PediatricCerebralCholesterolinosisExt', authenticate, (req, res) => {
  res.json(PediatricCerebralCholesterolinosisExt(req.body));
});

router.post('/call/PediatricVanishingWhiteMatterExt', authenticate, (req, res) => {
  res.json(PediatricVanishingWhiteMatterExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
