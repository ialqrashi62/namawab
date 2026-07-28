// pcc_pediatric_surg_ext25 routes v3.135.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricCleftLipExt3, PediatricCleftPalateExt, PediatricCraniosynostosisExt, PediatricPlagiocephalyExt, PediatricSyndactylyExt, PediatricPolydactylyExt, PediatricBrachialPlexusExt, PediatricCongenitalHandExt, PediatricPectusExcavatumExt, PediatricPectusCarinatumExt } = require('./pcc_pediatric_surg_ext25_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.135.0', module: 'pcc_pediatric_surg_ext25', label: 'PCC Pediatric Surg Ext25', functions: ['PediatricCleftLipExt3', 'PediatricCleftPalateExt', 'PediatricCraniosynostosisExt', 'PediatricPlagiocephalyExt', 'PediatricSyndactylyExt', 'PediatricPolydactylyExt', 'PediatricBrachialPlexusExt', 'PediatricCongenitalHandExt', 'PediatricPectusExcavatumExt', 'PediatricPectusCarinatumExt'] });
});
router.post('/call/PediatricCleftLipExt3', authenticate, (req, res) => {
  res.json(PediatricCleftLipExt3(req.body));
});

router.post('/call/PediatricCleftPalateExt', authenticate, (req, res) => {
  res.json(PediatricCleftPalateExt(req.body));
});

router.post('/call/PediatricCraniosynostosisExt', authenticate, (req, res) => {
  res.json(PediatricCraniosynostosisExt(req.body));
});

router.post('/call/PediatricPlagiocephalyExt', authenticate, (req, res) => {
  res.json(PediatricPlagiocephalyExt(req.body));
});

router.post('/call/PediatricSyndactylyExt', authenticate, (req, res) => {
  res.json(PediatricSyndactylyExt(req.body));
});

router.post('/call/PediatricPolydactylyExt', authenticate, (req, res) => {
  res.json(PediatricPolydactylyExt(req.body));
});

router.post('/call/PediatricBrachialPlexusExt', authenticate, (req, res) => {
  res.json(PediatricBrachialPlexusExt(req.body));
});

router.post('/call/PediatricCongenitalHandExt', authenticate, (req, res) => {
  res.json(PediatricCongenitalHandExt(req.body));
});

router.post('/call/PediatricPectusExcavatumExt', authenticate, (req, res) => {
  res.json(PediatricPectusExcavatumExt(req.body));
});

router.post('/call/PediatricPectusCarinatumExt', authenticate, (req, res) => {
  res.json(PediatricPectusCarinatumExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.135.0', module: 'pcc_pediatric_surg_ext25', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
