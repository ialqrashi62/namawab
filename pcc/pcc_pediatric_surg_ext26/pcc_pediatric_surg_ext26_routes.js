// pcc_pediatric_surg_ext26 routes v3.136.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricHydrocephalusExt, PediatricVPShuntPlacement, PediatricVPShuntRevision, PediatricETVExt, PediatricCraniotomyExt, PediatricCraniectomyExt, PediatricTumorResectionExt, PediatricSpinalCordTumorExt, PediatricChiariDecompression, PediatricTetheredCordRelease } = require('./pcc_pediatric_surg_ext26_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.136.0', module: 'pcc_pediatric_surg_ext26', label: 'PCC Pediatric Surg Ext26', functions: ['PediatricHydrocephalusExt', 'PediatricVPShuntPlacement', 'PediatricVPShuntRevision', 'PediatricETVExt', 'PediatricCraniotomyExt', 'PediatricCraniectomyExt', 'PediatricTumorResectionExt', 'PediatricSpinalCordTumorExt', 'PediatricChiariDecompression', 'PediatricTetheredCordRelease'] });
});
router.post('/call/PediatricHydrocephalusExt', authenticate, (req, res) => {
  res.json(PediatricHydrocephalusExt(req.body));
});

router.post('/call/PediatricVPShuntPlacement', authenticate, (req, res) => {
  res.json(PediatricVPShuntPlacement(req.body));
});

router.post('/call/PediatricVPShuntRevision', authenticate, (req, res) => {
  res.json(PediatricVPShuntRevision(req.body));
});

router.post('/call/PediatricETVExt', authenticate, (req, res) => {
  res.json(PediatricETVExt(req.body));
});

router.post('/call/PediatricCraniotomyExt', authenticate, (req, res) => {
  res.json(PediatricCraniotomyExt(req.body));
});

router.post('/call/PediatricCraniectomyExt', authenticate, (req, res) => {
  res.json(PediatricCraniectomyExt(req.body));
});

router.post('/call/PediatricTumorResectionExt', authenticate, (req, res) => {
  res.json(PediatricTumorResectionExt(req.body));
});

router.post('/call/PediatricSpinalCordTumorExt', authenticate, (req, res) => {
  res.json(PediatricSpinalCordTumorExt(req.body));
});

router.post('/call/PediatricChiariDecompression', authenticate, (req, res) => {
  res.json(PediatricChiariDecompression(req.body));
});

router.post('/call/PediatricTetheredCordRelease', authenticate, (req, res) => {
  res.json(PediatricTetheredCordRelease(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.136.0', module: 'pcc_pediatric_surg_ext26', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
