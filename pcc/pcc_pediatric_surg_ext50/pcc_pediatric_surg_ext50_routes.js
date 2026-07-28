// pcc_pediatric_surg_ext50 routes v3.160.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricNeurosurgerySpineExt, PediatricSpinalDeformityExt, PediatricScoliosisSurgeryExt2, PediatricKyphosisSurgeryExt2, PediatricSpinalFractureExt, PediatricSpinalCordDecompressionExt, PediatricSpinalTumorResectionExt, PediatricSyringomyeliaExt, PediatricTetheredCordReleaseExt2, PediatricSpinalStenosisExt } = require('./pcc_pediatric_surg_ext50_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.160.0', module: 'pcc_pediatric_surg_ext50', label: 'PCC Pediatric Surg Ext50', functions: ['PediatricNeurosurgerySpineExt', 'PediatricSpinalDeformityExt', 'PediatricScoliosisSurgeryExt2', 'PediatricKyphosisSurgeryExt2', 'PediatricSpinalFractureExt', 'PediatricSpinalCordDecompressionExt', 'PediatricSpinalTumorResectionExt', 'PediatricSyringomyeliaExt', 'PediatricTetheredCordReleaseExt2', 'PediatricSpinalStenosisExt'] });
});
router.post('/call/PediatricNeurosurgerySpineExt', authenticate, (req, res) => {
  res.json(PediatricNeurosurgerySpineExt(req.body));
});

router.post('/call/PediatricSpinalDeformityExt', authenticate, (req, res) => {
  res.json(PediatricSpinalDeformityExt(req.body));
});

router.post('/call/PediatricScoliosisSurgeryExt2', authenticate, (req, res) => {
  res.json(PediatricScoliosisSurgeryExt2(req.body));
});

router.post('/call/PediatricKyphosisSurgeryExt2', authenticate, (req, res) => {
  res.json(PediatricKyphosisSurgeryExt2(req.body));
});

router.post('/call/PediatricSpinalFractureExt', authenticate, (req, res) => {
  res.json(PediatricSpinalFractureExt(req.body));
});

router.post('/call/PediatricSpinalCordDecompressionExt', authenticate, (req, res) => {
  res.json(PediatricSpinalCordDecompressionExt(req.body));
});

router.post('/call/PediatricSpinalTumorResectionExt', authenticate, (req, res) => {
  res.json(PediatricSpinalTumorResectionExt(req.body));
});

router.post('/call/PediatricSyringomyeliaExt', authenticate, (req, res) => {
  res.json(PediatricSyringomyeliaExt(req.body));
});

router.post('/call/PediatricTetheredCordReleaseExt2', authenticate, (req, res) => {
  res.json(PediatricTetheredCordReleaseExt2(req.body));
});

router.post('/call/PediatricSpinalStenosisExt', authenticate, (req, res) => {
  res.json(PediatricSpinalStenosisExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.160.0', module: 'pcc_pediatric_surg_ext50', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
