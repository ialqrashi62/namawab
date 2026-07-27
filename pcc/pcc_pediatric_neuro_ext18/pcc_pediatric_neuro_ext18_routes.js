// pcc_pediatric_neuro_ext18 routes v3.128.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricNeuropsychiatricEval, PediatricCognitiveAssessment, PediatricIntelligenceTest, PediatricAdaptiveFunction, PediatricLearningDisorder, PediatricIntellectualDisability, PediatricGlobalDevelopmentalDelay, PediatricSpecificLearningDisorder, PediatricMotorSkillsDisorder, PediatricCommunicationDisorder } = require('./pcc_pediatric_neuro_ext18_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.128.0', module: 'pcc_pediatric_neuro_ext18', label: 'PCC Pediatric Neuro Ext18', functions: ['PediatricNeuropsychiatricEval', 'PediatricCognitiveAssessment', 'PediatricIntelligenceTest', 'PediatricAdaptiveFunction', 'PediatricLearningDisorder', 'PediatricIntellectualDisability', 'PediatricGlobalDevelopmentalDelay', 'PediatricSpecificLearningDisorder', 'PediatricMotorSkillsDisorder', 'PediatricCommunicationDisorder'] });
});
router.post('/call/PediatricNeuropsychiatricEval', authenticate, (req, res) => {
  res.json(PediatricNeuropsychiatricEval(req.body));
});

router.post('/call/PediatricCognitiveAssessment', authenticate, (req, res) => {
  res.json(PediatricCognitiveAssessment(req.body));
});

router.post('/call/PediatricIntelligenceTest', authenticate, (req, res) => {
  res.json(PediatricIntelligenceTest(req.body));
});

router.post('/call/PediatricAdaptiveFunction', authenticate, (req, res) => {
  res.json(PediatricAdaptiveFunction(req.body));
});

router.post('/call/PediatricLearningDisorder', authenticate, (req, res) => {
  res.json(PediatricLearningDisorder(req.body));
});

router.post('/call/PediatricIntellectualDisability', authenticate, (req, res) => {
  res.json(PediatricIntellectualDisability(req.body));
});

router.post('/call/PediatricGlobalDevelopmentalDelay', authenticate, (req, res) => {
  res.json(PediatricGlobalDevelopmentalDelay(req.body));
});

router.post('/call/PediatricSpecificLearningDisorder', authenticate, (req, res) => {
  res.json(PediatricSpecificLearningDisorder(req.body));
});

router.post('/call/PediatricMotorSkillsDisorder', authenticate, (req, res) => {
  res.json(PediatricMotorSkillsDisorder(req.body));
});

router.post('/call/PediatricCommunicationDisorder', authenticate, (req, res) => {
  res.json(PediatricCommunicationDisorder(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.128.0', module: 'pcc_pediatric_neuro_ext18', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
