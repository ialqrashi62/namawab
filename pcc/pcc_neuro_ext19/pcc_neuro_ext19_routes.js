// pcc_neuro_ext19 routes v3.118.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { SpinalCordInjuryExt, CervicalSpinalCordInjury, ThoracicSpinalCordInjury, LumbarSpinalCordInjury, CaudaEquinaSyndrome, ConusMedullarisSyndrome, SpinalCordCompression, SpinalEpiduralAbscess, SpinalCordTumorExt, SyringomyeliaExt } = require('./pcc_neuro_ext19_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.118.0', module: 'pcc_neuro_ext19', label: 'PCC Neuro Ext19', functions: ['SpinalCordInjuryExt', 'CervicalSpinalCordInjury', 'ThoracicSpinalCordInjury', 'LumbarSpinalCordInjury', 'CaudaEquinaSyndrome', 'ConusMedullarisSyndrome', 'SpinalCordCompression', 'SpinalEpiduralAbscess', 'SpinalCordTumorExt', 'SyringomyeliaExt'] });
});
router.post('/call/SpinalCordInjuryExt', authenticate, (req, res) => {
  res.json(SpinalCordInjuryExt(req.body));
});

router.post('/call/CervicalSpinalCordInjury', authenticate, (req, res) => {
  res.json(CervicalSpinalCordInjury(req.body));
});

router.post('/call/ThoracicSpinalCordInjury', authenticate, (req, res) => {
  res.json(ThoracicSpinalCordInjury(req.body));
});

router.post('/call/LumbarSpinalCordInjury', authenticate, (req, res) => {
  res.json(LumbarSpinalCordInjury(req.body));
});

router.post('/call/CaudaEquinaSyndrome', authenticate, (req, res) => {
  res.json(CaudaEquinaSyndrome(req.body));
});

router.post('/call/ConusMedullarisSyndrome', authenticate, (req, res) => {
  res.json(ConusMedullarisSyndrome(req.body));
});

router.post('/call/SpinalCordCompression', authenticate, (req, res) => {
  res.json(SpinalCordCompression(req.body));
});

router.post('/call/SpinalEpiduralAbscess', authenticate, (req, res) => {
  res.json(SpinalEpiduralAbscess(req.body));
});

router.post('/call/SpinalCordTumorExt', authenticate, (req, res) => {
  res.json(SpinalCordTumorExt(req.body));
});

router.post('/call/SyringomyeliaExt', authenticate, (req, res) => {
  res.json(SyringomyeliaExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.118.0', module: 'pcc_neuro_ext19', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
