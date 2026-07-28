// pcc_pediatric_surg_ext34 routes v3.144.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricTraumaSurgeryExt, PediatricSplenectomyExt, PediatricHepatectomyExt, PediatricPancreatectomyExt, PediatricNephrectomyTraumaExt, PediatricBowelResectionTraumaExt, PediatricDamageControlExt, PediatricVascularTraumaRepairExt, PediatricNerveRepairTraumaExt, PediatricTendonRepairTraumaExt } = require('./pcc_pediatric_surg_ext34_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.144.0', module: 'pcc_pediatric_surg_ext34', label: 'PCC Pediatric Surg Ext34', functions: ['PediatricTraumaSurgeryExt', 'PediatricSplenectomyExt', 'PediatricHepatectomyExt', 'PediatricPancreatectomyExt', 'PediatricNephrectomyTraumaExt', 'PediatricBowelResectionTraumaExt', 'PediatricDamageControlExt', 'PediatricVascularTraumaRepairExt', 'PediatricNerveRepairTraumaExt', 'PediatricTendonRepairTraumaExt'] });
});
router.post('/call/PediatricTraumaSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricTraumaSurgeryExt(req.body));
});

router.post('/call/PediatricSplenectomyExt', authenticate, (req, res) => {
  res.json(PediatricSplenectomyExt(req.body));
});

router.post('/call/PediatricHepatectomyExt', authenticate, (req, res) => {
  res.json(PediatricHepatectomyExt(req.body));
});

router.post('/call/PediatricPancreatectomyExt', authenticate, (req, res) => {
  res.json(PediatricPancreatectomyExt(req.body));
});

router.post('/call/PediatricNephrectomyTraumaExt', authenticate, (req, res) => {
  res.json(PediatricNephrectomyTraumaExt(req.body));
});

router.post('/call/PediatricBowelResectionTraumaExt', authenticate, (req, res) => {
  res.json(PediatricBowelResectionTraumaExt(req.body));
});

router.post('/call/PediatricDamageControlExt', authenticate, (req, res) => {
  res.json(PediatricDamageControlExt(req.body));
});

router.post('/call/PediatricVascularTraumaRepairExt', authenticate, (req, res) => {
  res.json(PediatricVascularTraumaRepairExt(req.body));
});

router.post('/call/PediatricNerveRepairTraumaExt', authenticate, (req, res) => {
  res.json(PediatricNerveRepairTraumaExt(req.body));
});

router.post('/call/PediatricTendonRepairTraumaExt', authenticate, (req, res) => {
  res.json(PediatricTendonRepairTraumaExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.144.0', module: 'pcc_pediatric_surg_ext34', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
