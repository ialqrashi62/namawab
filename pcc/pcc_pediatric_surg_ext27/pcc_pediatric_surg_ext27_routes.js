// pcc_pediatric_surg_ext27 routes v3.137.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricAsthmaSurgeryExt, PediatricCysticFibrosisExt, PediatricBronchiectasisSurg, PediatricLungResectionExt, PediatricPneumothoraxExt, PediatricChylothoraxExt, PediatricEmpyemaExt, PediatricLungBiopsyExt, PediatricTrachealReconstruction, PediatricAirwayStent } = require('./pcc_pediatric_surg_ext27_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.137.0', module: 'pcc_pediatric_surg_ext27', label: 'PCC Pediatric Surg Ext27', functions: ['PediatricAsthmaSurgeryExt', 'PediatricCysticFibrosisExt', 'PediatricBronchiectasisSurg', 'PediatricLungResectionExt', 'PediatricPneumothoraxExt', 'PediatricChylothoraxExt', 'PediatricEmpyemaExt', 'PediatricLungBiopsyExt', 'PediatricTrachealReconstruction', 'PediatricAirwayStent'] });
});
router.post('/call/PediatricAsthmaSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricAsthmaSurgeryExt(req.body));
});

router.post('/call/PediatricCysticFibrosisExt', authenticate, (req, res) => {
  res.json(PediatricCysticFibrosisExt(req.body));
});

router.post('/call/PediatricBronchiectasisSurg', authenticate, (req, res) => {
  res.json(PediatricBronchiectasisSurg(req.body));
});

router.post('/call/PediatricLungResectionExt', authenticate, (req, res) => {
  res.json(PediatricLungResectionExt(req.body));
});

router.post('/call/PediatricPneumothoraxExt', authenticate, (req, res) => {
  res.json(PediatricPneumothoraxExt(req.body));
});

router.post('/call/PediatricChylothoraxExt', authenticate, (req, res) => {
  res.json(PediatricChylothoraxExt(req.body));
});

router.post('/call/PediatricEmpyemaExt', authenticate, (req, res) => {
  res.json(PediatricEmpyemaExt(req.body));
});

router.post('/call/PediatricLungBiopsyExt', authenticate, (req, res) => {
  res.json(PediatricLungBiopsyExt(req.body));
});

router.post('/call/PediatricTrachealReconstruction', authenticate, (req, res) => {
  res.json(PediatricTrachealReconstruction(req.body));
});

router.post('/call/PediatricAirwayStent', authenticate, (req, res) => {
  res.json(PediatricAirwayStent(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.137.0', module: 'pcc_pediatric_surg_ext27', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
