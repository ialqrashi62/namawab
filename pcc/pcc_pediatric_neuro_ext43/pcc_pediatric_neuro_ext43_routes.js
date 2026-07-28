// pcc_pediatric_neuro_ext43 routes v3.153.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricTicDisorderExt3, PediatricTransientTicExt, PediatricChronicMotorTicExt, PediatricChronicVocalTicExt, PediatricTouretteSyndromeExt, PediatricTouretteComorbidityExt, PediatricTicRelatedOCDExt, PediatricTicRelatedADHDExt, PediatricTicRelatedAnxietyExt, PediatricTicPharmacologyExt } = require('./pcc_pediatric_neuro_ext43_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.153.0', module: 'pcc_pediatric_neuro_ext43', label: 'PCC Pediatric Neuro Ext43', functions: ['PediatricTicDisorderExt3', 'PediatricTransientTicExt', 'PediatricChronicMotorTicExt', 'PediatricChronicVocalTicExt', 'PediatricTouretteSyndromeExt', 'PediatricTouretteComorbidityExt', 'PediatricTicRelatedOCDExt', 'PediatricTicRelatedADHDExt', 'PediatricTicRelatedAnxietyExt', 'PediatricTicPharmacologyExt'] });
});
router.post('/call/PediatricTicDisorderExt3', authenticate, (req, res) => {
  res.json(PediatricTicDisorderExt3(req.body));
});

router.post('/call/PediatricTransientTicExt', authenticate, (req, res) => {
  res.json(PediatricTransientTicExt(req.body));
});

router.post('/call/PediatricChronicMotorTicExt', authenticate, (req, res) => {
  res.json(PediatricChronicMotorTicExt(req.body));
});

router.post('/call/PediatricChronicVocalTicExt', authenticate, (req, res) => {
  res.json(PediatricChronicVocalTicExt(req.body));
});

router.post('/call/PediatricTouretteSyndromeExt', authenticate, (req, res) => {
  res.json(PediatricTouretteSyndromeExt(req.body));
});

router.post('/call/PediatricTouretteComorbidityExt', authenticate, (req, res) => {
  res.json(PediatricTouretteComorbidityExt(req.body));
});

router.post('/call/PediatricTicRelatedOCDExt', authenticate, (req, res) => {
  res.json(PediatricTicRelatedOCDExt(req.body));
});

router.post('/call/PediatricTicRelatedADHDExt', authenticate, (req, res) => {
  res.json(PediatricTicRelatedADHDExt(req.body));
});

router.post('/call/PediatricTicRelatedAnxietyExt', authenticate, (req, res) => {
  res.json(PediatricTicRelatedAnxietyExt(req.body));
});

router.post('/call/PediatricTicPharmacologyExt', authenticate, (req, res) => {
  res.json(PediatricTicPharmacologyExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.153.0', module: 'pcc_pediatric_neuro_ext43', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
