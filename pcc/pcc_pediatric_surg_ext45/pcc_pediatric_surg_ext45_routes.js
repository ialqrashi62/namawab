// pcc_pediatric_surg_ext45 routes v3.155.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricVascularSurgeryExt, PediatricArteriovenousMalformationExt, PediatricVascularAnomalyExt, PediatricLymphaticMalformationExt, PediatricVenousMalformationExt, PediatricCapillaryMalformationExt, PediatricKlippelTrenaunayExt, PediatricParkesWeberExt, PediatricSturgeWeberSurgExt, PediatricKasabachMerrittExt } = require('./pcc_pediatric_surg_ext45_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.155.0', module: 'pcc_pediatric_surg_ext45', label: 'PCC Pediatric Surg Ext45', functions: ['PediatricVascularSurgeryExt', 'PediatricArteriovenousMalformationExt', 'PediatricVascularAnomalyExt', 'PediatricLymphaticMalformationExt', 'PediatricVenousMalformationExt', 'PediatricCapillaryMalformationExt', 'PediatricKlippelTrenaunayExt', 'PediatricParkesWeberExt', 'PediatricSturgeWeberSurgExt', 'PediatricKasabachMerrittExt'] });
});
router.post('/call/PediatricVascularSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricVascularSurgeryExt(req.body));
});

router.post('/call/PediatricArteriovenousMalformationExt', authenticate, (req, res) => {
  res.json(PediatricArteriovenousMalformationExt(req.body));
});

router.post('/call/PediatricVascularAnomalyExt', authenticate, (req, res) => {
  res.json(PediatricVascularAnomalyExt(req.body));
});

router.post('/call/PediatricLymphaticMalformationExt', authenticate, (req, res) => {
  res.json(PediatricLymphaticMalformationExt(req.body));
});

router.post('/call/PediatricVenousMalformationExt', authenticate, (req, res) => {
  res.json(PediatricVenousMalformationExt(req.body));
});

router.post('/call/PediatricCapillaryMalformationExt', authenticate, (req, res) => {
  res.json(PediatricCapillaryMalformationExt(req.body));
});

router.post('/call/PediatricKlippelTrenaunayExt', authenticate, (req, res) => {
  res.json(PediatricKlippelTrenaunayExt(req.body));
});

router.post('/call/PediatricParkesWeberExt', authenticate, (req, res) => {
  res.json(PediatricParkesWeberExt(req.body));
});

router.post('/call/PediatricSturgeWeberSurgExt', authenticate, (req, res) => {
  res.json(PediatricSturgeWeberSurgExt(req.body));
});

router.post('/call/PediatricKasabachMerrittExt', authenticate, (req, res) => {
  res.json(PediatricKasabachMerrittExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.155.0', module: 'pcc_pediatric_surg_ext45', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
