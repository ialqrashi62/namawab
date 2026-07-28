// pcc_neuro_ext36 routes v3.135.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { SleepWalkingExt2, SleepEatingDisorder, SleepTextingDisorder, SleepDrinkingDisorder, ExplodingHeadSyndromeExt, HypnicJerksExt, SleepBruxismExt, NocturnalLegCramps, RestlessLegSyndromeExt, PeriodicLimbMovementsExt2 } = require('./pcc_neuro_ext36_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.135.0', module: 'pcc_neuro_ext36', label: 'PCC Neuro Ext36', functions: ['SleepWalkingExt2', 'SleepEatingDisorder', 'SleepTextingDisorder', 'SleepDrinkingDisorder', 'ExplodingHeadSyndromeExt', 'HypnicJerksExt', 'SleepBruxismExt', 'NocturnalLegCramps', 'RestlessLegSyndromeExt', 'PeriodicLimbMovementsExt2'] });
});
router.post('/call/SleepWalkingExt2', authenticate, (req, res) => {
  res.json(SleepWalkingExt2(req.body));
});

router.post('/call/SleepEatingDisorder', authenticate, (req, res) => {
  res.json(SleepEatingDisorder(req.body));
});

router.post('/call/SleepTextingDisorder', authenticate, (req, res) => {
  res.json(SleepTextingDisorder(req.body));
});

router.post('/call/SleepDrinkingDisorder', authenticate, (req, res) => {
  res.json(SleepDrinkingDisorder(req.body));
});

router.post('/call/ExplodingHeadSyndromeExt', authenticate, (req, res) => {
  res.json(ExplodingHeadSyndromeExt(req.body));
});

router.post('/call/HypnicJerksExt', authenticate, (req, res) => {
  res.json(HypnicJerksExt(req.body));
});

router.post('/call/SleepBruxismExt', authenticate, (req, res) => {
  res.json(SleepBruxismExt(req.body));
});

router.post('/call/NocturnalLegCramps', authenticate, (req, res) => {
  res.json(NocturnalLegCramps(req.body));
});

router.post('/call/RestlessLegSyndromeExt', authenticate, (req, res) => {
  res.json(RestlessLegSyndromeExt(req.body));
});

router.post('/call/PeriodicLimbMovementsExt2', authenticate, (req, res) => {
  res.json(PeriodicLimbMovementsExt2(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.135.0', module: 'pcc_neuro_ext36', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
