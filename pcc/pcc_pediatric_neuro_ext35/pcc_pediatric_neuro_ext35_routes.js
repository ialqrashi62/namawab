// pcc_pediatric_neuro_ext35 routes v3.145.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricEliminationDisorderExt, PediatricEnuresisExt, PediatricEncopresisExt, PediatricFunctionalUrinaryRetention, PediatricFunctionalConstipationExt, PediatricToiletRefusal, PediatricStoolWithholdingExt, PediatricNightmaresExt, PediatricNightTerrorsExt, PediatricSleepwalkingExt } = require('./pcc_pediatric_neuro_ext35_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.145.0', module: 'pcc_pediatric_neuro_ext35', label: 'PCC Pediatric Neuro Ext35', functions: ['PediatricEliminationDisorderExt', 'PediatricEnuresisExt', 'PediatricEncopresisExt', 'PediatricFunctionalUrinaryRetention', 'PediatricFunctionalConstipationExt', 'PediatricToiletRefusal', 'PediatricStoolWithholdingExt', 'PediatricNightmaresExt', 'PediatricNightTerrorsExt', 'PediatricSleepwalkingExt'] });
});
router.post('/call/PediatricEliminationDisorderExt', authenticate, (req, res) => {
  res.json(PediatricEliminationDisorderExt(req.body));
});

router.post('/call/PediatricEnuresisExt', authenticate, (req, res) => {
  res.json(PediatricEnuresisExt(req.body));
});

router.post('/call/PediatricEncopresisExt', authenticate, (req, res) => {
  res.json(PediatricEncopresisExt(req.body));
});

router.post('/call/PediatricFunctionalUrinaryRetention', authenticate, (req, res) => {
  res.json(PediatricFunctionalUrinaryRetention(req.body));
});

router.post('/call/PediatricFunctionalConstipationExt', authenticate, (req, res) => {
  res.json(PediatricFunctionalConstipationExt(req.body));
});

router.post('/call/PediatricToiletRefusal', authenticate, (req, res) => {
  res.json(PediatricToiletRefusal(req.body));
});

router.post('/call/PediatricStoolWithholdingExt', authenticate, (req, res) => {
  res.json(PediatricStoolWithholdingExt(req.body));
});

router.post('/call/PediatricNightmaresExt', authenticate, (req, res) => {
  res.json(PediatricNightmaresExt(req.body));
});

router.post('/call/PediatricNightTerrorsExt', authenticate, (req, res) => {
  res.json(PediatricNightTerrorsExt(req.body));
});

router.post('/call/PediatricSleepwalkingExt', authenticate, (req, res) => {
  res.json(PediatricSleepwalkingExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.145.0', module: 'pcc_pediatric_neuro_ext35', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
