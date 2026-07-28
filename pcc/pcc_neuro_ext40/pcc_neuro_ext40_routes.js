// pcc_neuro_ext40 routes v3.139.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { MultipleSclerosisExt2, NeuromyelitisOpticaExt, MOGAntibodyDisorderExt, AcuteDisseminatedEncephalomyelitis, ClinicallyIsolatedSyndromeExt, RadiologicallyIsolatedSyndrome, ProgressiveMultifocalLeukoencephalopathy, ADEMExt2, CerebralVasculitisExt, CNSLupusExt } = require('./pcc_neuro_ext40_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.139.0', module: 'pcc_neuro_ext40', label: 'PCC Neuro Ext40', functions: ['MultipleSclerosisExt2', 'NeuromyelitisOpticaExt', 'MOGAntibodyDisorderExt', 'AcuteDisseminatedEncephalomyelitis', 'ClinicallyIsolatedSyndromeExt', 'RadiologicallyIsolatedSyndrome', 'ProgressiveMultifocalLeukoencephalopathy', 'ADEMExt2', 'CerebralVasculitisExt', 'CNSLupusExt'] });
});
router.post('/call/MultipleSclerosisExt2', authenticate, (req, res) => {
  res.json(MultipleSclerosisExt2(req.body));
});

router.post('/call/NeuromyelitisOpticaExt', authenticate, (req, res) => {
  res.json(NeuromyelitisOpticaExt(req.body));
});

router.post('/call/MOGAntibodyDisorderExt', authenticate, (req, res) => {
  res.json(MOGAntibodyDisorderExt(req.body));
});

router.post('/call/AcuteDisseminatedEncephalomyelitis', authenticate, (req, res) => {
  res.json(AcuteDisseminatedEncephalomyelitis(req.body));
});

router.post('/call/ClinicallyIsolatedSyndromeExt', authenticate, (req, res) => {
  res.json(ClinicallyIsolatedSyndromeExt(req.body));
});

router.post('/call/RadiologicallyIsolatedSyndrome', authenticate, (req, res) => {
  res.json(RadiologicallyIsolatedSyndrome(req.body));
});

router.post('/call/ProgressiveMultifocalLeukoencephalopathy', authenticate, (req, res) => {
  res.json(ProgressiveMultifocalLeukoencephalopathy(req.body));
});

router.post('/call/ADEMExt2', authenticate, (req, res) => {
  res.json(ADEMExt2(req.body));
});

router.post('/call/CerebralVasculitisExt', authenticate, (req, res) => {
  res.json(CerebralVasculitisExt(req.body));
});

router.post('/call/CNSLupusExt', authenticate, (req, res) => {
  res.json(CNSLupusExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.139.0', module: 'pcc_neuro_ext40', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
