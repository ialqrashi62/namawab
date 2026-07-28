// pcc_neuro_ext48 routes v3.147.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { MotorNeuronDiseaseExt, AmyotrophicLateralSclerosisExt, PrimaryLateralSclerosisExt, ProgressiveBulbarPalsyExt, ProgressiveMuscularAtrophyExt, FlailArmSyndromeExt, FlailLegSyndromeExt, KennedyDiseaseExt, SpinalMuscularAtrophyAdultExt, MultifocalMotorNeuropathyExt } = require('./pcc_neuro_ext48_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.147.0', module: 'pcc_neuro_ext48', label: 'PCC Neuro Ext48', functions: ['MotorNeuronDiseaseExt', 'AmyotrophicLateralSclerosisExt', 'PrimaryLateralSclerosisExt', 'ProgressiveBulbarPalsyExt', 'ProgressiveMuscularAtrophyExt', 'FlailArmSyndromeExt', 'FlailLegSyndromeExt', 'KennedyDiseaseExt', 'SpinalMuscularAtrophyAdultExt', 'MultifocalMotorNeuropathyExt'] });
});
router.post('/call/MotorNeuronDiseaseExt', authenticate, (req, res) => {
  res.json(MotorNeuronDiseaseExt(req.body));
});

router.post('/call/AmyotrophicLateralSclerosisExt', authenticate, (req, res) => {
  res.json(AmyotrophicLateralSclerosisExt(req.body));
});

router.post('/call/PrimaryLateralSclerosisExt', authenticate, (req, res) => {
  res.json(PrimaryLateralSclerosisExt(req.body));
});

router.post('/call/ProgressiveBulbarPalsyExt', authenticate, (req, res) => {
  res.json(ProgressiveBulbarPalsyExt(req.body));
});

router.post('/call/ProgressiveMuscularAtrophyExt', authenticate, (req, res) => {
  res.json(ProgressiveMuscularAtrophyExt(req.body));
});

router.post('/call/FlailArmSyndromeExt', authenticate, (req, res) => {
  res.json(FlailArmSyndromeExt(req.body));
});

router.post('/call/FlailLegSyndromeExt', authenticate, (req, res) => {
  res.json(FlailLegSyndromeExt(req.body));
});

router.post('/call/KennedyDiseaseExt', authenticate, (req, res) => {
  res.json(KennedyDiseaseExt(req.body));
});

router.post('/call/SpinalMuscularAtrophyAdultExt', authenticate, (req, res) => {
  res.json(SpinalMuscularAtrophyAdultExt(req.body));
});

router.post('/call/MultifocalMotorNeuropathyExt', authenticate, (req, res) => {
  res.json(MultifocalMotorNeuropathyExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.147.0', module: 'pcc_neuro_ext48', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
