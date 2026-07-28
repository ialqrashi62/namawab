// pcc_neuro_ext41 routes v3.140.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { ParkinsonDiseaseExt3, MultipleSystemAtrophyExt, ProgressiveSupranuclearPalsy, CorticobasalDegeneration, LewyBodyDementiaExt, ParkinsonismDementiaComplex, VascularParkinsonismExt, DrugInducedParkinsonism, EssentialTremorExt2, DystonicTremorExt } = require('./pcc_neuro_ext41_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.140.0', module: 'pcc_neuro_ext41', label: 'PCC Neuro Ext41', functions: ['ParkinsonDiseaseExt3', 'MultipleSystemAtrophyExt', 'ProgressiveSupranuclearPalsy', 'CorticobasalDegeneration', 'LewyBodyDementiaExt', 'ParkinsonismDementiaComplex', 'VascularParkinsonismExt', 'DrugInducedParkinsonism', 'EssentialTremorExt2', 'DystonicTremorExt'] });
});
router.post('/call/ParkinsonDiseaseExt3', authenticate, (req, res) => {
  res.json(ParkinsonDiseaseExt3(req.body));
});

router.post('/call/MultipleSystemAtrophyExt', authenticate, (req, res) => {
  res.json(MultipleSystemAtrophyExt(req.body));
});

router.post('/call/ProgressiveSupranuclearPalsy', authenticate, (req, res) => {
  res.json(ProgressiveSupranuclearPalsy(req.body));
});

router.post('/call/CorticobasalDegeneration', authenticate, (req, res) => {
  res.json(CorticobasalDegeneration(req.body));
});

router.post('/call/LewyBodyDementiaExt', authenticate, (req, res) => {
  res.json(LewyBodyDementiaExt(req.body));
});

router.post('/call/ParkinsonismDementiaComplex', authenticate, (req, res) => {
  res.json(ParkinsonismDementiaComplex(req.body));
});

router.post('/call/VascularParkinsonismExt', authenticate, (req, res) => {
  res.json(VascularParkinsonismExt(req.body));
});

router.post('/call/DrugInducedParkinsonism', authenticate, (req, res) => {
  res.json(DrugInducedParkinsonism(req.body));
});

router.post('/call/EssentialTremorExt2', authenticate, (req, res) => {
  res.json(EssentialTremorExt2(req.body));
});

router.post('/call/DystonicTremorExt', authenticate, (req, res) => {
  res.json(DystonicTremorExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.140.0', module: 'pcc_neuro_ext41', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
