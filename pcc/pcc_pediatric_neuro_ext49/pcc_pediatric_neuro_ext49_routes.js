// pcc_pediatric_neuro_ext49 routes v3.159.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricSeizureDisorderExt3, PediatricFebrileStatusEpilepticusExt, PediatricRefractoryEpilepsyExt, PediatricEpilepsySurgeryEvalExt, PediatricVagusNerveStimulationExt, PediatricKetogenicDietExt, PediatricEpilepsyGeneticExt, PediatricEpilepsyMetabolicExt, PediatricEpilepsyAutoimmuneExt, PediatricSUDEPExt } = require('./pcc_pediatric_neuro_ext49_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.159.0', module: 'pcc_pediatric_neuro_ext49', label: 'PCC Pediatric Neuro Ext49', functions: ['PediatricSeizureDisorderExt3', 'PediatricFebrileStatusEpilepticusExt', 'PediatricRefractoryEpilepsyExt', 'PediatricEpilepsySurgeryEvalExt', 'PediatricVagusNerveStimulationExt', 'PediatricKetogenicDietExt', 'PediatricEpilepsyGeneticExt', 'PediatricEpilepsyMetabolicExt', 'PediatricEpilepsyAutoimmuneExt', 'PediatricSUDEPExt'] });
});
router.post('/call/PediatricSeizureDisorderExt3', authenticate, (req, res) => {
  res.json(PediatricSeizureDisorderExt3(req.body));
});

router.post('/call/PediatricFebrileStatusEpilepticusExt', authenticate, (req, res) => {
  res.json(PediatricFebrileStatusEpilepticusExt(req.body));
});

router.post('/call/PediatricRefractoryEpilepsyExt', authenticate, (req, res) => {
  res.json(PediatricRefractoryEpilepsyExt(req.body));
});

router.post('/call/PediatricEpilepsySurgeryEvalExt', authenticate, (req, res) => {
  res.json(PediatricEpilepsySurgeryEvalExt(req.body));
});

router.post('/call/PediatricVagusNerveStimulationExt', authenticate, (req, res) => {
  res.json(PediatricVagusNerveStimulationExt(req.body));
});

router.post('/call/PediatricKetogenicDietExt', authenticate, (req, res) => {
  res.json(PediatricKetogenicDietExt(req.body));
});

router.post('/call/PediatricEpilepsyGeneticExt', authenticate, (req, res) => {
  res.json(PediatricEpilepsyGeneticExt(req.body));
});

router.post('/call/PediatricEpilepsyMetabolicExt', authenticate, (req, res) => {
  res.json(PediatricEpilepsyMetabolicExt(req.body));
});

router.post('/call/PediatricEpilepsyAutoimmuneExt', authenticate, (req, res) => {
  res.json(PediatricEpilepsyAutoimmuneExt(req.body));
});

router.post('/call/PediatricSUDEPExt', authenticate, (req, res) => {
  res.json(PediatricSUDEPExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.159.0', module: 'pcc_pediatric_neuro_ext49', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
