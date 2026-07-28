// pcc_neuro_ext51 routes v3.150.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { SyringomyeliaExt, SyringobulbiaExt, ChiariMalformationType1Ext, ChiariMalformationType2Ext, ChiariMalformationType3Ext, TetheredCordSyndromeExt, OccultSpinalDysraphismExt, SpinalLipomaExt, DermalSinusTractExt, DiastematomyeliaExt } = require('./pcc_neuro_ext51_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.150.0', module: 'pcc_neuro_ext51', label: 'PCC Neuro Ext51', functions: ['SyringomyeliaExt', 'SyringobulbiaExt', 'ChiariMalformationType1Ext', 'ChiariMalformationType2Ext', 'ChiariMalformationType3Ext', 'TetheredCordSyndromeExt', 'OccultSpinalDysraphismExt', 'SpinalLipomaExt', 'DermalSinusTractExt', 'DiastematomyeliaExt'] });
});
router.post('/call/SyringomyeliaExt', authenticate, (req, res) => {
  res.json(SyringomyeliaExt(req.body));
});

router.post('/call/SyringobulbiaExt', authenticate, (req, res) => {
  res.json(SyringobulbiaExt(req.body));
});

router.post('/call/ChiariMalformationType1Ext', authenticate, (req, res) => {
  res.json(ChiariMalformationType1Ext(req.body));
});

router.post('/call/ChiariMalformationType2Ext', authenticate, (req, res) => {
  res.json(ChiariMalformationType2Ext(req.body));
});

router.post('/call/ChiariMalformationType3Ext', authenticate, (req, res) => {
  res.json(ChiariMalformationType3Ext(req.body));
});

router.post('/call/TetheredCordSyndromeExt', authenticate, (req, res) => {
  res.json(TetheredCordSyndromeExt(req.body));
});

router.post('/call/OccultSpinalDysraphismExt', authenticate, (req, res) => {
  res.json(OccultSpinalDysraphismExt(req.body));
});

router.post('/call/SpinalLipomaExt', authenticate, (req, res) => {
  res.json(SpinalLipomaExt(req.body));
});

router.post('/call/DermalSinusTractExt', authenticate, (req, res) => {
  res.json(DermalSinusTractExt(req.body));
});

router.post('/call/DiastematomyeliaExt', authenticate, (req, res) => {
  res.json(DiastematomyeliaExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.150.0', module: 'pcc_neuro_ext51', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
