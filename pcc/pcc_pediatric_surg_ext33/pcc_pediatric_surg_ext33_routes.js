// pcc_pediatric_surg_ext33 routes v3.143.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricOrthopedicExt2, PediatricScoliosisSurgeryExt, PediatricSpinalFusionExt, PediatricGrowingRodsExt, PediatricMAGECRodsExt, PediatricVEPTRExt, PediatricTetheredCordExt, PediatricSpondylolisthesisExt, PediatricKyphosisSurgeryExt, PediatricLordosisCorrectionExt } = require('./pcc_pediatric_surg_ext33_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.143.0', module: 'pcc_pediatric_surg_ext33', label: 'PCC Pediatric Surg Ext33', functions: ['PediatricOrthopedicExt2', 'PediatricScoliosisSurgeryExt', 'PediatricSpinalFusionExt', 'PediatricGrowingRodsExt', 'PediatricMAGECRodsExt', 'PediatricVEPTRExt', 'PediatricTetheredCordExt', 'PediatricSpondylolisthesisExt', 'PediatricKyphosisSurgeryExt', 'PediatricLordosisCorrectionExt'] });
});
router.post('/call/PediatricOrthopedicExt2', authenticate, (req, res) => {
  res.json(PediatricOrthopedicExt2(req.body));
});

router.post('/call/PediatricScoliosisSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricScoliosisSurgeryExt(req.body));
});

router.post('/call/PediatricSpinalFusionExt', authenticate, (req, res) => {
  res.json(PediatricSpinalFusionExt(req.body));
});

router.post('/call/PediatricGrowingRodsExt', authenticate, (req, res) => {
  res.json(PediatricGrowingRodsExt(req.body));
});

router.post('/call/PediatricMAGECRodsExt', authenticate, (req, res) => {
  res.json(PediatricMAGECRodsExt(req.body));
});

router.post('/call/PediatricVEPTRExt', authenticate, (req, res) => {
  res.json(PediatricVEPTRExt(req.body));
});

router.post('/call/PediatricTetheredCordExt', authenticate, (req, res) => {
  res.json(PediatricTetheredCordExt(req.body));
});

router.post('/call/PediatricSpondylolisthesisExt', authenticate, (req, res) => {
  res.json(PediatricSpondylolisthesisExt(req.body));
});

router.post('/call/PediatricKyphosisSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricKyphosisSurgeryExt(req.body));
});

router.post('/call/PediatricLordosisCorrectionExt', authenticate, (req, res) => {
  res.json(PediatricLordosisCorrectionExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.143.0', module: 'pcc_pediatric_surg_ext33', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
