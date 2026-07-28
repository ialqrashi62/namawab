// pcc_neuro_ext42 routes v3.141.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { CharcotMarieToothExt, HereditaryNeuropathyExt, GuillainBarreSyndromeExt, CIDPExt, VasculiticNeuropathyExt, DiabeticNeuropathyExt, AlcoholicNeuropathyExt, SmallFiberNeuropathyExt, AutonomicNeuropathyExt, IdiopathicNeuropathyExt } = require('./pcc_neuro_ext42_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.141.0', module: 'pcc_neuro_ext42', label: 'PCC Neuro Ext42', functions: ['CharcotMarieToothExt', 'HereditaryNeuropathyExt', 'GuillainBarreSyndromeExt', 'CIDPExt', 'VasculiticNeuropathyExt', 'DiabeticNeuropathyExt', 'AlcoholicNeuropathyExt', 'SmallFiberNeuropathyExt', 'AutonomicNeuropathyExt', 'IdiopathicNeuropathyExt'] });
});
router.post('/call/CharcotMarieToothExt', authenticate, (req, res) => {
  res.json(CharcotMarieToothExt(req.body));
});

router.post('/call/HereditaryNeuropathyExt', authenticate, (req, res) => {
  res.json(HereditaryNeuropathyExt(req.body));
});

router.post('/call/GuillainBarreSyndromeExt', authenticate, (req, res) => {
  res.json(GuillainBarreSyndromeExt(req.body));
});

router.post('/call/CIDPExt', authenticate, (req, res) => {
  res.json(CIDPExt(req.body));
});

router.post('/call/VasculiticNeuropathyExt', authenticate, (req, res) => {
  res.json(VasculiticNeuropathyExt(req.body));
});

router.post('/call/DiabeticNeuropathyExt', authenticate, (req, res) => {
  res.json(DiabeticNeuropathyExt(req.body));
});

router.post('/call/AlcoholicNeuropathyExt', authenticate, (req, res) => {
  res.json(AlcoholicNeuropathyExt(req.body));
});

router.post('/call/SmallFiberNeuropathyExt', authenticate, (req, res) => {
  res.json(SmallFiberNeuropathyExt(req.body));
});

router.post('/call/AutonomicNeuropathyExt', authenticate, (req, res) => {
  res.json(AutonomicNeuropathyExt(req.body));
});

router.post('/call/IdiopathicNeuropathyExt', authenticate, (req, res) => {
  res.json(IdiopathicNeuropathyExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.141.0', module: 'pcc_neuro_ext42', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
