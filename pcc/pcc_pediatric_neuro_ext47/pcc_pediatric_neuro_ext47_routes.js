// pcc_pediatric_neuro_ext47 routes v3.157.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricVasculitisExt3, PediatricKawasakiVasculopathyExt, PediatricHenochSchonleinExt, PediatricANCAVasculitisExt, PediatricTakayasuExt, PediatricPolyarteritisExt, PediatricMicroscopicPolyangiitisExt, PediatricGranulomatosisVasculitisExt, PediatricChurgStraussExt, PediatricBehcetExt } = require('./pcc_pediatric_neuro_ext47_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.157.0', module: 'pcc_pediatric_neuro_ext47', label: 'PCC Pediatric Neuro Ext47', functions: ['PediatricVasculitisExt3', 'PediatricKawasakiVasculopathyExt', 'PediatricHenochSchonleinExt', 'PediatricANCAVasculitisExt', 'PediatricTakayasuExt', 'PediatricPolyarteritisExt', 'PediatricMicroscopicPolyangiitisExt', 'PediatricGranulomatosisVasculitisExt', 'PediatricChurgStraussExt', 'PediatricBehcetExt'] });
});
router.post('/call/PediatricVasculitisExt3', authenticate, (req, res) => {
  res.json(PediatricVasculitisExt3(req.body));
});

router.post('/call/PediatricKawasakiVasculopathyExt', authenticate, (req, res) => {
  res.json(PediatricKawasakiVasculopathyExt(req.body));
});

router.post('/call/PediatricHenochSchonleinExt', authenticate, (req, res) => {
  res.json(PediatricHenochSchonleinExt(req.body));
});

router.post('/call/PediatricANCAVasculitisExt', authenticate, (req, res) => {
  res.json(PediatricANCAVasculitisExt(req.body));
});

router.post('/call/PediatricTakayasuExt', authenticate, (req, res) => {
  res.json(PediatricTakayasuExt(req.body));
});

router.post('/call/PediatricPolyarteritisExt', authenticate, (req, res) => {
  res.json(PediatricPolyarteritisExt(req.body));
});

router.post('/call/PediatricMicroscopicPolyangiitisExt', authenticate, (req, res) => {
  res.json(PediatricMicroscopicPolyangiitisExt(req.body));
});

router.post('/call/PediatricGranulomatosisVasculitisExt', authenticate, (req, res) => {
  res.json(PediatricGranulomatosisVasculitisExt(req.body));
});

router.post('/call/PediatricChurgStraussExt', authenticate, (req, res) => {
  res.json(PediatricChurgStraussExt(req.body));
});

router.post('/call/PediatricBehcetExt', authenticate, (req, res) => {
  res.json(PediatricBehcetExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.157.0', module: 'pcc_pediatric_neuro_ext47', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
