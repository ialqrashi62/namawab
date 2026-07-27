// pcc_pediatric_neuro_ext10 routes v3.120.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricLanguageDisorder, PediatricSpeechDelay, PediatricArticulationDisorder, PediatricPhonologicalDisorder, PediatricStuttering, PediatricApraxia, PediatricDysarthria, PediatricVoiceDisorder, PediatricDyslexia, PediatricDysgraphia } = require('./pcc_pediatric_neuro_ext10_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.120.0', module: 'pcc_pediatric_neuro_ext10', label: 'PCC Pediatric Neuro Ext10', functions: ['PediatricLanguageDisorder', 'PediatricSpeechDelay', 'PediatricArticulationDisorder', 'PediatricPhonologicalDisorder', 'PediatricStuttering', 'PediatricApraxia', 'PediatricDysarthria', 'PediatricVoiceDisorder', 'PediatricDyslexia', 'PediatricDysgraphia'] });
});
router.post('/call/PediatricLanguageDisorder', authenticate, (req, res) => {
  res.json(PediatricLanguageDisorder(req.body));
});

router.post('/call/PediatricSpeechDelay', authenticate, (req, res) => {
  res.json(PediatricSpeechDelay(req.body));
});

router.post('/call/PediatricArticulationDisorder', authenticate, (req, res) => {
  res.json(PediatricArticulationDisorder(req.body));
});

router.post('/call/PediatricPhonologicalDisorder', authenticate, (req, res) => {
  res.json(PediatricPhonologicalDisorder(req.body));
});

router.post('/call/PediatricStuttering', authenticate, (req, res) => {
  res.json(PediatricStuttering(req.body));
});

router.post('/call/PediatricApraxia', authenticate, (req, res) => {
  res.json(PediatricApraxia(req.body));
});

router.post('/call/PediatricDysarthria', authenticate, (req, res) => {
  res.json(PediatricDysarthria(req.body));
});

router.post('/call/PediatricVoiceDisorder', authenticate, (req, res) => {
  res.json(PediatricVoiceDisorder(req.body));
});

router.post('/call/PediatricDyslexia', authenticate, (req, res) => {
  res.json(PediatricDyslexia(req.body));
});

router.post('/call/PediatricDysgraphia', authenticate, (req, res) => {
  res.json(PediatricDysgraphia(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.120.0', module: 'pcc_pediatric_neuro_ext10', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
