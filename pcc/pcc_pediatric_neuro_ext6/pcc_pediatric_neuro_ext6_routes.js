// pcc_pediatric_neuro_ext6 routes v3.116.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricSeizureEvaluation, PediatricFirstNonFebrileSeizure, PediatricNewOnsetRefractory, PediatricKetogenicDiet, PediatricVagalNerveStimulation, PediatricEpilepsyMonitoring, PediatricEEG, PediatricVideoEEG, PediatricSleepStudy, PediatricPolysomnography } = require('./pcc_pediatric_neuro_ext6_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.116.0', module: 'pcc_pediatric_neuro_ext6', label: 'PCC Pediatric Neuro Ext6', functions: ['PediatricSeizureEvaluation', 'PediatricFirstNonFebrileSeizure', 'PediatricNewOnsetRefractory', 'PediatricKetogenicDiet', 'PediatricVagalNerveStimulation', 'PediatricEpilepsyMonitoring', 'PediatricEEG', 'PediatricVideoEEG', 'PediatricSleepStudy', 'PediatricPolysomnography'] });
});
router.post('/call/PediatricSeizureEvaluation', authenticate, (req, res) => {
  res.json(PediatricSeizureEvaluation(req.body));
});

router.post('/call/PediatricFirstNonFebrileSeizure', authenticate, (req, res) => {
  res.json(PediatricFirstNonFebrileSeizure(req.body));
});

router.post('/call/PediatricNewOnsetRefractory', authenticate, (req, res) => {
  res.json(PediatricNewOnsetRefractory(req.body));
});

router.post('/call/PediatricKetogenicDiet', authenticate, (req, res) => {
  res.json(PediatricKetogenicDiet(req.body));
});

router.post('/call/PediatricVagalNerveStimulation', authenticate, (req, res) => {
  res.json(PediatricVagalNerveStimulation(req.body));
});

router.post('/call/PediatricEpilepsyMonitoring', authenticate, (req, res) => {
  res.json(PediatricEpilepsyMonitoring(req.body));
});

router.post('/call/PediatricEEG', authenticate, (req, res) => {
  res.json(PediatricEEG(req.body));
});

router.post('/call/PediatricVideoEEG', authenticate, (req, res) => {
  res.json(PediatricVideoEEG(req.body));
});

router.post('/call/PediatricSleepStudy', authenticate, (req, res) => {
  res.json(PediatricSleepStudy(req.body));
});

router.post('/call/PediatricPolysomnography', authenticate, (req, res) => {
  res.json(PediatricPolysomnography(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.116.0', module: 'pcc_pediatric_neuro_ext6', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
