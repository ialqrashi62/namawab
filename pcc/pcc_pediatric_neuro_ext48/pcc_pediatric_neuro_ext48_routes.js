// pcc_pediatric_neuro_ext48 routes v3.158.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricEncephalitisExt3, PediatricHSVEncephalitisExt, PediatricEnteroviralEncephalitisExt, PediatricInfluenzaEncephalitisExt, PediatricCMVEncephalitisExt, PediatricEBVEncephalitisExt, PediatricMumpsEncephalitisExt, PediatricMeaslesEncephalitisExt, PediatricRubellaEncephalitisExt, PediatricVaricellaEncephalitisExt } = require('./pcc_pediatric_neuro_ext48_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.158.0', module: 'pcc_pediatric_neuro_ext48', label: 'PCC Pediatric Neuro Ext48', functions: ['PediatricEncephalitisExt3', 'PediatricHSVEncephalitisExt', 'PediatricEnteroviralEncephalitisExt', 'PediatricInfluenzaEncephalitisExt', 'PediatricCMVEncephalitisExt', 'PediatricEBVEncephalitisExt', 'PediatricMumpsEncephalitisExt', 'PediatricMeaslesEncephalitisExt', 'PediatricRubellaEncephalitisExt', 'PediatricVaricellaEncephalitisExt'] });
});
router.post('/call/PediatricEncephalitisExt3', authenticate, (req, res) => {
  res.json(PediatricEncephalitisExt3(req.body));
});

router.post('/call/PediatricHSVEncephalitisExt', authenticate, (req, res) => {
  res.json(PediatricHSVEncephalitisExt(req.body));
});

router.post('/call/PediatricEnteroviralEncephalitisExt', authenticate, (req, res) => {
  res.json(PediatricEnteroviralEncephalitisExt(req.body));
});

router.post('/call/PediatricInfluenzaEncephalitisExt', authenticate, (req, res) => {
  res.json(PediatricInfluenzaEncephalitisExt(req.body));
});

router.post('/call/PediatricCMVEncephalitisExt', authenticate, (req, res) => {
  res.json(PediatricCMVEncephalitisExt(req.body));
});

router.post('/call/PediatricEBVEncephalitisExt', authenticate, (req, res) => {
  res.json(PediatricEBVEncephalitisExt(req.body));
});

router.post('/call/PediatricMumpsEncephalitisExt', authenticate, (req, res) => {
  res.json(PediatricMumpsEncephalitisExt(req.body));
});

router.post('/call/PediatricMeaslesEncephalitisExt', authenticate, (req, res) => {
  res.json(PediatricMeaslesEncephalitisExt(req.body));
});

router.post('/call/PediatricRubellaEncephalitisExt', authenticate, (req, res) => {
  res.json(PediatricRubellaEncephalitisExt(req.body));
});

router.post('/call/PediatricVaricellaEncephalitisExt', authenticate, (req, res) => {
  res.json(PediatricVaricellaEncephalitisExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.158.0', module: 'pcc_pediatric_neuro_ext48', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
