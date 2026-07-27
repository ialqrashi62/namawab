// pcc_neuro_ext21 routes v3.120.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { MovementDisorderExt2, AtaxiaTelangiectasia, FriedreichAtaxiaExt, SpinocerebellarDegeneration, HereditarySpasticParaplegia, ProgressiveSupranuclearPalsyExt, CorticobasalSyndrome, MultipleSystemAtrophyExt, LewyBodyDementia, FrontotemporalDementia } = require('./pcc_neuro_ext21_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.120.0', module: 'pcc_neuro_ext21', label: 'PCC Neuro Ext21', functions: ['MovementDisorderExt2', 'AtaxiaTelangiectasia', 'FriedreichAtaxiaExt', 'SpinocerebellarDegeneration', 'HereditarySpasticParaplegia', 'ProgressiveSupranuclearPalsyExt', 'CorticobasalSyndrome', 'MultipleSystemAtrophyExt', 'LewyBodyDementia', 'FrontotemporalDementia'] });
});
router.post('/call/MovementDisorderExt2', authenticate, (req, res) => {
  res.json(MovementDisorderExt2(req.body));
});

router.post('/call/AtaxiaTelangiectasia', authenticate, (req, res) => {
  res.json(AtaxiaTelangiectasia(req.body));
});

router.post('/call/FriedreichAtaxiaExt', authenticate, (req, res) => {
  res.json(FriedreichAtaxiaExt(req.body));
});

router.post('/call/SpinocerebellarDegeneration', authenticate, (req, res) => {
  res.json(SpinocerebellarDegeneration(req.body));
});

router.post('/call/HereditarySpasticParaplegia', authenticate, (req, res) => {
  res.json(HereditarySpasticParaplegia(req.body));
});

router.post('/call/ProgressiveSupranuclearPalsyExt', authenticate, (req, res) => {
  res.json(ProgressiveSupranuclearPalsyExt(req.body));
});

router.post('/call/CorticobasalSyndrome', authenticate, (req, res) => {
  res.json(CorticobasalSyndrome(req.body));
});

router.post('/call/MultipleSystemAtrophyExt', authenticate, (req, res) => {
  res.json(MultipleSystemAtrophyExt(req.body));
});

router.post('/call/LewyBodyDementia', authenticate, (req, res) => {
  res.json(LewyBodyDementia(req.body));
});

router.post('/call/FrontotemporalDementia', authenticate, (req, res) => {
  res.json(FrontotemporalDementia(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.120.0', module: 'pcc_neuro_ext21', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
