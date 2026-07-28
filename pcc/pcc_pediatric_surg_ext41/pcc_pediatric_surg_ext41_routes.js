// pcc_pediatric_surg_ext41 routes v3.151.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricBariatricSurgeryExt, PediatricSleeveGastrectomyExt, PediatricGastricBypassExt, PediatricAdjustableBandExt, PediatricBiliopancreaticDiversionExt, PediatricDuodenalSwitchExt, PediatricRevisionalBariatricExt, PediatricCholecystectomyExt, PediatricSplenectomyHematologicExt, PediatricLiverResectionExt } = require('./pcc_pediatric_surg_ext41_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.151.0', module: 'pcc_pediatric_surg_ext41', label: 'PCC Pediatric Surg Ext41', functions: ['PediatricBariatricSurgeryExt', 'PediatricSleeveGastrectomyExt', 'PediatricGastricBypassExt', 'PediatricAdjustableBandExt', 'PediatricBiliopancreaticDiversionExt', 'PediatricDuodenalSwitchExt', 'PediatricRevisionalBariatricExt', 'PediatricCholecystectomyExt', 'PediatricSplenectomyHematologicExt', 'PediatricLiverResectionExt'] });
});
router.post('/call/PediatricBariatricSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricBariatricSurgeryExt(req.body));
});

router.post('/call/PediatricSleeveGastrectomyExt', authenticate, (req, res) => {
  res.json(PediatricSleeveGastrectomyExt(req.body));
});

router.post('/call/PediatricGastricBypassExt', authenticate, (req, res) => {
  res.json(PediatricGastricBypassExt(req.body));
});

router.post('/call/PediatricAdjustableBandExt', authenticate, (req, res) => {
  res.json(PediatricAdjustableBandExt(req.body));
});

router.post('/call/PediatricBiliopancreaticDiversionExt', authenticate, (req, res) => {
  res.json(PediatricBiliopancreaticDiversionExt(req.body));
});

router.post('/call/PediatricDuodenalSwitchExt', authenticate, (req, res) => {
  res.json(PediatricDuodenalSwitchExt(req.body));
});

router.post('/call/PediatricRevisionalBariatricExt', authenticate, (req, res) => {
  res.json(PediatricRevisionalBariatricExt(req.body));
});

router.post('/call/PediatricCholecystectomyExt', authenticate, (req, res) => {
  res.json(PediatricCholecystectomyExt(req.body));
});

router.post('/call/PediatricSplenectomyHematologicExt', authenticate, (req, res) => {
  res.json(PediatricSplenectomyHematologicExt(req.body));
});

router.post('/call/PediatricLiverResectionExt', authenticate, (req, res) => {
  res.json(PediatricLiverResectionExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.151.0', module: 'pcc_pediatric_surg_ext41', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
