// pcc_pediatric_surg_ext29 routes v3.139.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricLimbReconstructionExt, PediatricLimbLengtheningExt, PediatricLimbShorteningExt, PediatricDeformityCorrectionExt, PediatricFractureFixationExt, PediatricTendonRepairExt, PediatricLigamentReconstructionExt, PediatricACLReconstructionExt, PediatricMeniscusRepairExt, PediatricHipDysplasiaExt } = require('./pcc_pediatric_surg_ext29_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.139.0', module: 'pcc_pediatric_surg_ext29', label: 'PCC Pediatric Surg Ext29', functions: ['PediatricLimbReconstructionExt', 'PediatricLimbLengtheningExt', 'PediatricLimbShorteningExt', 'PediatricDeformityCorrectionExt', 'PediatricFractureFixationExt', 'PediatricTendonRepairExt', 'PediatricLigamentReconstructionExt', 'PediatricACLReconstructionExt', 'PediatricMeniscusRepairExt', 'PediatricHipDysplasiaExt'] });
});
router.post('/call/PediatricLimbReconstructionExt', authenticate, (req, res) => {
  res.json(PediatricLimbReconstructionExt(req.body));
});

router.post('/call/PediatricLimbLengtheningExt', authenticate, (req, res) => {
  res.json(PediatricLimbLengtheningExt(req.body));
});

router.post('/call/PediatricLimbShorteningExt', authenticate, (req, res) => {
  res.json(PediatricLimbShorteningExt(req.body));
});

router.post('/call/PediatricDeformityCorrectionExt', authenticate, (req, res) => {
  res.json(PediatricDeformityCorrectionExt(req.body));
});

router.post('/call/PediatricFractureFixationExt', authenticate, (req, res) => {
  res.json(PediatricFractureFixationExt(req.body));
});

router.post('/call/PediatricTendonRepairExt', authenticate, (req, res) => {
  res.json(PediatricTendonRepairExt(req.body));
});

router.post('/call/PediatricLigamentReconstructionExt', authenticate, (req, res) => {
  res.json(PediatricLigamentReconstructionExt(req.body));
});

router.post('/call/PediatricACLReconstructionExt', authenticate, (req, res) => {
  res.json(PediatricACLReconstructionExt(req.body));
});

router.post('/call/PediatricMeniscusRepairExt', authenticate, (req, res) => {
  res.json(PediatricMeniscusRepairExt(req.body));
});

router.post('/call/PediatricHipDysplasiaExt', authenticate, (req, res) => {
  res.json(PediatricHipDysplasiaExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.139.0', module: 'pcc_pediatric_surg_ext29', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
