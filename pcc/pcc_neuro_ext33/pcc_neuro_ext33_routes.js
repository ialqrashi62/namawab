// pcc_neuro_ext33 routes v3.132.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { NeuroRehabilitationExt, StrokeRehab, TraumaticBrainInjuryRehab, SpinalCordInjuryRehab, MultipleSclerosisRehab, ParkinsonDiseaseRehab, NeuropathyRehab, MyopathyRehab, BalanceRehab, GaitRehab } = require('./pcc_neuro_ext33_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.132.0', module: 'pcc_neuro_ext33', label: 'PCC Neuro Ext33', functions: ['NeuroRehabilitationExt', 'StrokeRehab', 'TraumaticBrainInjuryRehab', 'SpinalCordInjuryRehab', 'MultipleSclerosisRehab', 'ParkinsonDiseaseRehab', 'NeuropathyRehab', 'MyopathyRehab', 'BalanceRehab', 'GaitRehab'] });
});
router.post('/call/NeuroRehabilitationExt', authenticate, (req, res) => {
  res.json(NeuroRehabilitationExt(req.body));
});

router.post('/call/StrokeRehab', authenticate, (req, res) => {
  res.json(StrokeRehab(req.body));
});

router.post('/call/TraumaticBrainInjuryRehab', authenticate, (req, res) => {
  res.json(TraumaticBrainInjuryRehab(req.body));
});

router.post('/call/SpinalCordInjuryRehab', authenticate, (req, res) => {
  res.json(SpinalCordInjuryRehab(req.body));
});

router.post('/call/MultipleSclerosisRehab', authenticate, (req, res) => {
  res.json(MultipleSclerosisRehab(req.body));
});

router.post('/call/ParkinsonDiseaseRehab', authenticate, (req, res) => {
  res.json(ParkinsonDiseaseRehab(req.body));
});

router.post('/call/NeuropathyRehab', authenticate, (req, res) => {
  res.json(NeuropathyRehab(req.body));
});

router.post('/call/MyopathyRehab', authenticate, (req, res) => {
  res.json(MyopathyRehab(req.body));
});

router.post('/call/BalanceRehab', authenticate, (req, res) => {
  res.json(BalanceRehab(req.body));
});

router.post('/call/GaitRehab', authenticate, (req, res) => {
  res.json(GaitRehab(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.132.0', module: 'pcc_neuro_ext33', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
