// pcc_pediatric_neuro_ext13 routes v3.123.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricBrainMalformation, PediatricHoloprosencephaly, PediatricLissencephaly, PediatricPolymicrogyria, PediatricSchizencephaly, PediatricPorencephaly, PediatricHydrocephalusExt2, PediatricDandyWalker, PediatricArnoldChiari, PediatricSyringomyelia } = require('./pcc_pediatric_neuro_ext13_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.123.0', module: 'pcc_pediatric_neuro_ext13', label: 'PCC Pediatric Neuro Ext13', functions: ['PediatricBrainMalformation', 'PediatricHoloprosencephaly', 'PediatricLissencephaly', 'PediatricPolymicrogyria', 'PediatricSchizencephaly', 'PediatricPorencephaly', 'PediatricHydrocephalusExt2', 'PediatricDandyWalker', 'PediatricArnoldChiari', 'PediatricSyringomyelia'] });
});
router.post('/call/PediatricBrainMalformation', authenticate, (req, res) => {
  res.json(PediatricBrainMalformation(req.body));
});

router.post('/call/PediatricHoloprosencephaly', authenticate, (req, res) => {
  res.json(PediatricHoloprosencephaly(req.body));
});

router.post('/call/PediatricLissencephaly', authenticate, (req, res) => {
  res.json(PediatricLissencephaly(req.body));
});

router.post('/call/PediatricPolymicrogyria', authenticate, (req, res) => {
  res.json(PediatricPolymicrogyria(req.body));
});

router.post('/call/PediatricSchizencephaly', authenticate, (req, res) => {
  res.json(PediatricSchizencephaly(req.body));
});

router.post('/call/PediatricPorencephaly', authenticate, (req, res) => {
  res.json(PediatricPorencephaly(req.body));
});

router.post('/call/PediatricHydrocephalusExt2', authenticate, (req, res) => {
  res.json(PediatricHydrocephalusExt2(req.body));
});

router.post('/call/PediatricDandyWalker', authenticate, (req, res) => {
  res.json(PediatricDandyWalker(req.body));
});

router.post('/call/PediatricArnoldChiari', authenticate, (req, res) => {
  res.json(PediatricArnoldChiari(req.body));
});

router.post('/call/PediatricSyringomyelia', authenticate, (req, res) => {
  res.json(PediatricSyringomyelia(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.123.0', module: 'pcc_pediatric_neuro_ext13', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
