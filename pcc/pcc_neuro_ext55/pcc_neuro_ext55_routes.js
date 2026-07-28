// pcc_neuro_ext55 routes v3.154.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { CreutzfeldtJakobDiseaseExt, VariantCJDExt, GerstmannStrausslerScheinkerExt, KuruExt, BovineSpongiformEncephalopathyExt, FatalFamilialInsomniaExt, SporadicFatalInsomniaExt, VariablyProteaseSensitivePrionopathyExt, PrionProteinCerebralAmyloidAngiopathyExt, PrionDiseaseDiagnosisExt } = require('./pcc_neuro_ext55_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.154.0', module: 'pcc_neuro_ext55', label: 'PCC Neuro Ext55', functions: ['CreutzfeldtJakobDiseaseExt', 'VariantCJDExt', 'GerstmannStrausslerScheinkerExt', 'KuruExt', 'BovineSpongiformEncephalopathyExt', 'FatalFamilialInsomniaExt', 'SporadicFatalInsomniaExt', 'VariablyProteaseSensitivePrionopathyExt', 'PrionProteinCerebralAmyloidAngiopathyExt', 'PrionDiseaseDiagnosisExt'] });
});
router.post('/call/CreutzfeldtJakobDiseaseExt', authenticate, (req, res) => {
  res.json(CreutzfeldtJakobDiseaseExt(req.body));
});

router.post('/call/VariantCJDExt', authenticate, (req, res) => {
  res.json(VariantCJDExt(req.body));
});

router.post('/call/GerstmannStrausslerScheinkerExt', authenticate, (req, res) => {
  res.json(GerstmannStrausslerScheinkerExt(req.body));
});

router.post('/call/KuruExt', authenticate, (req, res) => {
  res.json(KuruExt(req.body));
});

router.post('/call/BovineSpongiformEncephalopathyExt', authenticate, (req, res) => {
  res.json(BovineSpongiformEncephalopathyExt(req.body));
});

router.post('/call/FatalFamilialInsomniaExt', authenticate, (req, res) => {
  res.json(FatalFamilialInsomniaExt(req.body));
});

router.post('/call/SporadicFatalInsomniaExt', authenticate, (req, res) => {
  res.json(SporadicFatalInsomniaExt(req.body));
});

router.post('/call/VariablyProteaseSensitivePrionopathyExt', authenticate, (req, res) => {
  res.json(VariablyProteaseSensitivePrionopathyExt(req.body));
});

router.post('/call/PrionProteinCerebralAmyloidAngiopathyExt', authenticate, (req, res) => {
  res.json(PrionProteinCerebralAmyloidAngiopathyExt(req.body));
});

router.post('/call/PrionDiseaseDiagnosisExt', authenticate, (req, res) => {
  res.json(PrionDiseaseDiagnosisExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.154.0', module: 'pcc_neuro_ext55', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
