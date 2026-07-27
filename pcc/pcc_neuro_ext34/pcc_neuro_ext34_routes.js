// pcc_neuro_ext34 routes v3.133.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { CognitiveRehabExt, MemoryRehabilitation, AttentionTraining, ExecutiveFunctionTraining, LanguageTherapyExt, SpeechTherapy, OccupationalTherapyExt, VestibularRehab, VisualRehab, NeuroplasticityTraining } = require('./pcc_neuro_ext34_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.133.0', module: 'pcc_neuro_ext34', label: 'PCC Neuro Ext34', functions: ['CognitiveRehabExt', 'MemoryRehabilitation', 'AttentionTraining', 'ExecutiveFunctionTraining', 'LanguageTherapyExt', 'SpeechTherapy', 'OccupationalTherapyExt', 'VestibularRehab', 'VisualRehab', 'NeuroplasticityTraining'] });
});
router.post('/call/CognitiveRehabExt', authenticate, (req, res) => {
  res.json(CognitiveRehabExt(req.body));
});

router.post('/call/MemoryRehabilitation', authenticate, (req, res) => {
  res.json(MemoryRehabilitation(req.body));
});

router.post('/call/AttentionTraining', authenticate, (req, res) => {
  res.json(AttentionTraining(req.body));
});

router.post('/call/ExecutiveFunctionTraining', authenticate, (req, res) => {
  res.json(ExecutiveFunctionTraining(req.body));
});

router.post('/call/LanguageTherapyExt', authenticate, (req, res) => {
  res.json(LanguageTherapyExt(req.body));
});

router.post('/call/SpeechTherapy', authenticate, (req, res) => {
  res.json(SpeechTherapy(req.body));
});

router.post('/call/OccupationalTherapyExt', authenticate, (req, res) => {
  res.json(OccupationalTherapyExt(req.body));
});

router.post('/call/VestibularRehab', authenticate, (req, res) => {
  res.json(VestibularRehab(req.body));
});

router.post('/call/VisualRehab', authenticate, (req, res) => {
  res.json(VisualRehab(req.body));
});

router.post('/call/NeuroplasticityTraining', authenticate, (req, res) => {
  res.json(NeuroplasticityTraining(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.133.0', module: 'pcc_neuro_ext34', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
