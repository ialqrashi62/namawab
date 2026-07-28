// pcc_pediatric_neuro_ext41 routes v3.151.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricDemyelinatingExt, PediatricMSAdultLikeExt, PediatricMOGADExt, PediatricNMOSDExt, PediatricADEMEpiExt, PediatricOpticNeuritisExt, PediatricTransverseMyelitisExt, PediatricClinicallyIsolatedSyndromeExt, PediatricRadiologicallyIsolatedExt, PediatricMyelinOligodendrocyteExt } = require('./pcc_pediatric_neuro_ext41_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.151.0', module: 'pcc_pediatric_neuro_ext41', label: 'PCC Pediatric Neuro Ext41', functions: ['PediatricDemyelinatingExt', 'PediatricMSAdultLikeExt', 'PediatricMOGADExt', 'PediatricNMOSDExt', 'PediatricADEMEpiExt', 'PediatricOpticNeuritisExt', 'PediatricTransverseMyelitisExt', 'PediatricClinicallyIsolatedSyndromeExt', 'PediatricRadiologicallyIsolatedExt', 'PediatricMyelinOligodendrocyteExt'] });
});
router.post('/call/PediatricDemyelinatingExt', authenticate, (req, res) => {
  res.json(PediatricDemyelinatingExt(req.body));
});

router.post('/call/PediatricMSAdultLikeExt', authenticate, (req, res) => {
  res.json(PediatricMSAdultLikeExt(req.body));
});

router.post('/call/PediatricMOGADExt', authenticate, (req, res) => {
  res.json(PediatricMOGADExt(req.body));
});

router.post('/call/PediatricNMOSDExt', authenticate, (req, res) => {
  res.json(PediatricNMOSDExt(req.body));
});

router.post('/call/PediatricADEMEpiExt', authenticate, (req, res) => {
  res.json(PediatricADEMEpiExt(req.body));
});

router.post('/call/PediatricOpticNeuritisExt', authenticate, (req, res) => {
  res.json(PediatricOpticNeuritisExt(req.body));
});

router.post('/call/PediatricTransverseMyelitisExt', authenticate, (req, res) => {
  res.json(PediatricTransverseMyelitisExt(req.body));
});

router.post('/call/PediatricClinicallyIsolatedSyndromeExt', authenticate, (req, res) => {
  res.json(PediatricClinicallyIsolatedSyndromeExt(req.body));
});

router.post('/call/PediatricRadiologicallyIsolatedExt', authenticate, (req, res) => {
  res.json(PediatricRadiologicallyIsolatedExt(req.body));
});

router.post('/call/PediatricMyelinOligodendrocyteExt', authenticate, (req, res) => {
  res.json(PediatricMyelinOligodendrocyteExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.151.0', module: 'pcc_pediatric_neuro_ext41', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
