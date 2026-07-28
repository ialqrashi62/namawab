// pcc_neuro_ext56 routes v3.155.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { WernickeEncephalopathyExt, KorsakoffSyndromeExt, WernickeKorsakoffExt, AlcoholicCerebellarDegenerationExt, MarchiafavaBignamiExt, AlcoholRelatedDementiaExt, CentralPontineMyelinolysisExt, OsmoticDemyelinationExt, CobalaminDeficiencyExt, FolateDeficiencyExt } = require('./pcc_neuro_ext56_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.155.0', module: 'pcc_neuro_ext56', label: 'PCC Neuro Ext56', functions: ['WernickeEncephalopathyExt', 'KorsakoffSyndromeExt', 'WernickeKorsakoffExt', 'AlcoholicCerebellarDegenerationExt', 'MarchiafavaBignamiExt', 'AlcoholRelatedDementiaExt', 'CentralPontineMyelinolysisExt', 'OsmoticDemyelinationExt', 'CobalaminDeficiencyExt', 'FolateDeficiencyExt'] });
});
router.post('/call/WernickeEncephalopathyExt', authenticate, (req, res) => {
  res.json(WernickeEncephalopathyExt(req.body));
});

router.post('/call/KorsakoffSyndromeExt', authenticate, (req, res) => {
  res.json(KorsakoffSyndromeExt(req.body));
});

router.post('/call/WernickeKorsakoffExt', authenticate, (req, res) => {
  res.json(WernickeKorsakoffExt(req.body));
});

router.post('/call/AlcoholicCerebellarDegenerationExt', authenticate, (req, res) => {
  res.json(AlcoholicCerebellarDegenerationExt(req.body));
});

router.post('/call/MarchiafavaBignamiExt', authenticate, (req, res) => {
  res.json(MarchiafavaBignamiExt(req.body));
});

router.post('/call/AlcoholRelatedDementiaExt', authenticate, (req, res) => {
  res.json(AlcoholRelatedDementiaExt(req.body));
});

router.post('/call/CentralPontineMyelinolysisExt', authenticate, (req, res) => {
  res.json(CentralPontineMyelinolysisExt(req.body));
});

router.post('/call/OsmoticDemyelinationExt', authenticate, (req, res) => {
  res.json(OsmoticDemyelinationExt(req.body));
});

router.post('/call/CobalaminDeficiencyExt', authenticate, (req, res) => {
  res.json(CobalaminDeficiencyExt(req.body));
});

router.post('/call/FolateDeficiencyExt', authenticate, (req, res) => {
  res.json(FolateDeficiencyExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.155.0', module: 'pcc_neuro_ext56', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
