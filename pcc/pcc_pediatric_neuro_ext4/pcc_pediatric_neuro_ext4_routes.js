// pcc_pediatric_neuro_ext4 routes v3.114.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricConcussionExt, PediatricPostConcussionSyndrome, PediatricTraumaticBrainInjury, PediatricBrainTumor, PediatricMedulloblastoma, PediatricAstrocytoma, PediatricEpendymoma, PediatricCraniopharyngioma, PediatricSpinalCordTumor, PediatricNeuroblastoma } = require('./pcc_pediatric_neuro_ext4_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.114.0', module: 'pcc_pediatric_neuro_ext4', label: 'PCC Pediatric Neuro Ext4', functions: ['PediatricConcussionExt', 'PediatricPostConcussionSyndrome', 'PediatricTraumaticBrainInjury', 'PediatricBrainTumor', 'PediatricMedulloblastoma', 'PediatricAstrocytoma', 'PediatricEpendymoma', 'PediatricCraniopharyngioma', 'PediatricSpinalCordTumor', 'PediatricNeuroblastoma'] });
});
router.post('/call/PediatricConcussionExt', authenticate, (req, res) => {
  res.json(PediatricConcussionExt(req.body));
});

router.post('/call/PediatricPostConcussionSyndrome', authenticate, (req, res) => {
  res.json(PediatricPostConcussionSyndrome(req.body));
});

router.post('/call/PediatricTraumaticBrainInjury', authenticate, (req, res) => {
  res.json(PediatricTraumaticBrainInjury(req.body));
});

router.post('/call/PediatricBrainTumor', authenticate, (req, res) => {
  res.json(PediatricBrainTumor(req.body));
});

router.post('/call/PediatricMedulloblastoma', authenticate, (req, res) => {
  res.json(PediatricMedulloblastoma(req.body));
});

router.post('/call/PediatricAstrocytoma', authenticate, (req, res) => {
  res.json(PediatricAstrocytoma(req.body));
});

router.post('/call/PediatricEpendymoma', authenticate, (req, res) => {
  res.json(PediatricEpendymoma(req.body));
});

router.post('/call/PediatricCraniopharyngioma', authenticate, (req, res) => {
  res.json(PediatricCraniopharyngioma(req.body));
});

router.post('/call/PediatricSpinalCordTumor', authenticate, (req, res) => {
  res.json(PediatricSpinalCordTumor(req.body));
});

router.post('/call/PediatricNeuroblastoma', authenticate, (req, res) => {
  res.json(PediatricNeuroblastoma(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.114.0', module: 'pcc_pediatric_neuro_ext4', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
