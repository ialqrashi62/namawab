// pcc_pediatric_surg_ext36 routes v3.146.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricThoracicSurgeryExt, PediatricPectusRepairExt, PediatricNussProcedureExt, PediatricRavitchProcedureExt, PediatricEsophagealAtresiaExt, PediatricTEFistulaExt, PediatricDiaphragmaticHerniaExt, PediatricCDHRepairExt, PediatricEventrationExt, PediatricPhrenicNervePalsyExt } = require('./pcc_pediatric_surg_ext36_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.146.0', module: 'pcc_pediatric_surg_ext36', label: 'PCC Pediatric Surg Ext36', functions: ['PediatricThoracicSurgeryExt', 'PediatricPectusRepairExt', 'PediatricNussProcedureExt', 'PediatricRavitchProcedureExt', 'PediatricEsophagealAtresiaExt', 'PediatricTEFistulaExt', 'PediatricDiaphragmaticHerniaExt', 'PediatricCDHRepairExt', 'PediatricEventrationExt', 'PediatricPhrenicNervePalsyExt'] });
});
router.post('/call/PediatricThoracicSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricThoracicSurgeryExt(req.body));
});

router.post('/call/PediatricPectusRepairExt', authenticate, (req, res) => {
  res.json(PediatricPectusRepairExt(req.body));
});

router.post('/call/PediatricNussProcedureExt', authenticate, (req, res) => {
  res.json(PediatricNussProcedureExt(req.body));
});

router.post('/call/PediatricRavitchProcedureExt', authenticate, (req, res) => {
  res.json(PediatricRavitchProcedureExt(req.body));
});

router.post('/call/PediatricEsophagealAtresiaExt', authenticate, (req, res) => {
  res.json(PediatricEsophagealAtresiaExt(req.body));
});

router.post('/call/PediatricTEFistulaExt', authenticate, (req, res) => {
  res.json(PediatricTEFistulaExt(req.body));
});

router.post('/call/PediatricDiaphragmaticHerniaExt', authenticate, (req, res) => {
  res.json(PediatricDiaphragmaticHerniaExt(req.body));
});

router.post('/call/PediatricCDHRepairExt', authenticate, (req, res) => {
  res.json(PediatricCDHRepairExt(req.body));
});

router.post('/call/PediatricEventrationExt', authenticate, (req, res) => {
  res.json(PediatricEventrationExt(req.body));
});

router.post('/call/PediatricPhrenicNervePalsyExt', authenticate, (req, res) => {
  res.json(PediatricPhrenicNervePalsyExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.146.0', module: 'pcc_pediatric_surg_ext36', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
