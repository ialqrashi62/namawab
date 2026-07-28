// pcc_neuro_ext38 routes v3.137.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { TrigeminalNeuralgiaExt, GlossopharyngealNeuralgia, OccipitalNeuralgiaExt, PostherpeticNeuralgiaExt, TrigeminalNeuropathyExt, TrigeminalTrophicSyndrome, BurningMouthSyndromeExt, AtypicalOdontalgiaExt, ClusterTicSyndromeExt, SUNCTDisorderExt } = require('./pcc_neuro_ext38_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.137.0', module: 'pcc_neuro_ext38', label: 'PCC Neuro Ext38', functions: ['TrigeminalNeuralgiaExt', 'GlossopharyngealNeuralgia', 'OccipitalNeuralgiaExt', 'PostherpeticNeuralgiaExt', 'TrigeminalNeuropathyExt', 'TrigeminalTrophicSyndrome', 'BurningMouthSyndromeExt', 'AtypicalOdontalgiaExt', 'ClusterTicSyndromeExt', 'SUNCTDisorderExt'] });
});
router.post('/call/TrigeminalNeuralgiaExt', authenticate, (req, res) => {
  res.json(TrigeminalNeuralgiaExt(req.body));
});

router.post('/call/GlossopharyngealNeuralgia', authenticate, (req, res) => {
  res.json(GlossopharyngealNeuralgia(req.body));
});

router.post('/call/OccipitalNeuralgiaExt', authenticate, (req, res) => {
  res.json(OccipitalNeuralgiaExt(req.body));
});

router.post('/call/PostherpeticNeuralgiaExt', authenticate, (req, res) => {
  res.json(PostherpeticNeuralgiaExt(req.body));
});

router.post('/call/TrigeminalNeuropathyExt', authenticate, (req, res) => {
  res.json(TrigeminalNeuropathyExt(req.body));
});

router.post('/call/TrigeminalTrophicSyndrome', authenticate, (req, res) => {
  res.json(TrigeminalTrophicSyndrome(req.body));
});

router.post('/call/BurningMouthSyndromeExt', authenticate, (req, res) => {
  res.json(BurningMouthSyndromeExt(req.body));
});

router.post('/call/AtypicalOdontalgiaExt', authenticate, (req, res) => {
  res.json(AtypicalOdontalgiaExt(req.body));
});

router.post('/call/ClusterTicSyndromeExt', authenticate, (req, res) => {
  res.json(ClusterTicSyndromeExt(req.body));
});

router.post('/call/SUNCTDisorderExt', authenticate, (req, res) => {
  res.json(SUNCTDisorderExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.137.0', module: 'pcc_neuro_ext38', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
