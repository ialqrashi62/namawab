// pcc_pediatric_surg_ext44 routes v3.154.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricENTReconstructionExt, PediatricTrachealResectionExt, PediatricLaryngotrachealReconstructionExt, PediatricCricotrachealResectionExt, PediatricLaryngoplastyExt, PediatricPhonosurgeryExt, PediatricBronchoscopyTherapeuticExt, PediatricEsophagealDilatationExt, PediatricEsophagealReplacementExt, PediatricPharyngealReconstructionExt } = require('./pcc_pediatric_surg_ext44_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.154.0', module: 'pcc_pediatric_surg_ext44', label: 'PCC Pediatric Surg Ext44', functions: ['PediatricENTReconstructionExt', 'PediatricTrachealResectionExt', 'PediatricLaryngotrachealReconstructionExt', 'PediatricCricotrachealResectionExt', 'PediatricLaryngoplastyExt', 'PediatricPhonosurgeryExt', 'PediatricBronchoscopyTherapeuticExt', 'PediatricEsophagealDilatationExt', 'PediatricEsophagealReplacementExt', 'PediatricPharyngealReconstructionExt'] });
});
router.post('/call/PediatricENTReconstructionExt', authenticate, (req, res) => {
  res.json(PediatricENTReconstructionExt(req.body));
});

router.post('/call/PediatricTrachealResectionExt', authenticate, (req, res) => {
  res.json(PediatricTrachealResectionExt(req.body));
});

router.post('/call/PediatricLaryngotrachealReconstructionExt', authenticate, (req, res) => {
  res.json(PediatricLaryngotrachealReconstructionExt(req.body));
});

router.post('/call/PediatricCricotrachealResectionExt', authenticate, (req, res) => {
  res.json(PediatricCricotrachealResectionExt(req.body));
});

router.post('/call/PediatricLaryngoplastyExt', authenticate, (req, res) => {
  res.json(PediatricLaryngoplastyExt(req.body));
});

router.post('/call/PediatricPhonosurgeryExt', authenticate, (req, res) => {
  res.json(PediatricPhonosurgeryExt(req.body));
});

router.post('/call/PediatricBronchoscopyTherapeuticExt', authenticate, (req, res) => {
  res.json(PediatricBronchoscopyTherapeuticExt(req.body));
});

router.post('/call/PediatricEsophagealDilatationExt', authenticate, (req, res) => {
  res.json(PediatricEsophagealDilatationExt(req.body));
});

router.post('/call/PediatricEsophagealReplacementExt', authenticate, (req, res) => {
  res.json(PediatricEsophagealReplacementExt(req.body));
});

router.post('/call/PediatricPharyngealReconstructionExt', authenticate, (req, res) => {
  res.json(PediatricPharyngealReconstructionExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.154.0', module: 'pcc_pediatric_surg_ext44', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
