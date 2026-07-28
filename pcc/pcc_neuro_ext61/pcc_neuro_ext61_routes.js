// pcc_neuro_ext61 routes v3.160.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { SpinocerebellarAtaxiaAutosomalDominantExt, SpinocerebellarAtaxiaAutosomalRecessiveExt, ChildhoodAtaxiaWithCentralNervousSystemExt, AtaxiaOculomotorApraxiaExt, FriedreichAtaxiaExtendedExt, MarinescoSjogrenSyndromeExt, CoenzymeQ10DeficiencyAtaxiaExt, AbetalipoproteinemiaAtaxiaExt, AtaxiaTelangiectasiaVariantExt, SpinocerebellarAtaxiaType7Ext } = require('./pcc_neuro_ext61_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.160.0', module: 'pcc_neuro_ext61', label: 'PCC Neuro Ext61', functions: ['SpinocerebellarAtaxiaAutosomalDominantExt', 'SpinocerebellarAtaxiaAutosomalRecessiveExt', 'ChildhoodAtaxiaWithCentralNervousSystemExt', 'AtaxiaOculomotorApraxiaExt', 'FriedreichAtaxiaExtendedExt', 'MarinescoSjogrenSyndromeExt', 'CoenzymeQ10DeficiencyAtaxiaExt', 'AbetalipoproteinemiaAtaxiaExt', 'AtaxiaTelangiectasiaVariantExt', 'SpinocerebellarAtaxiaType7Ext'] });
});
router.post('/call/SpinocerebellarAtaxiaAutosomalDominantExt', authenticate, (req, res) => {
  res.json(SpinocerebellarAtaxiaAutosomalDominantExt(req.body));
});

router.post('/call/SpinocerebellarAtaxiaAutosomalRecessiveExt', authenticate, (req, res) => {
  res.json(SpinocerebellarAtaxiaAutosomalRecessiveExt(req.body));
});

router.post('/call/ChildhoodAtaxiaWithCentralNervousSystemExt', authenticate, (req, res) => {
  res.json(ChildhoodAtaxiaWithCentralNervousSystemExt(req.body));
});

router.post('/call/AtaxiaOculomotorApraxiaExt', authenticate, (req, res) => {
  res.json(AtaxiaOculomotorApraxiaExt(req.body));
});

router.post('/call/FriedreichAtaxiaExtendedExt', authenticate, (req, res) => {
  res.json(FriedreichAtaxiaExtendedExt(req.body));
});

router.post('/call/MarinescoSjogrenSyndromeExt', authenticate, (req, res) => {
  res.json(MarinescoSjogrenSyndromeExt(req.body));
});

router.post('/call/CoenzymeQ10DeficiencyAtaxiaExt', authenticate, (req, res) => {
  res.json(CoenzymeQ10DeficiencyAtaxiaExt(req.body));
});

router.post('/call/AbetalipoproteinemiaAtaxiaExt', authenticate, (req, res) => {
  res.json(AbetalipoproteinemiaAtaxiaExt(req.body));
});

router.post('/call/AtaxiaTelangiectasiaVariantExt', authenticate, (req, res) => {
  res.json(AtaxiaTelangiectasiaVariantExt(req.body));
});

router.post('/call/SpinocerebellarAtaxiaType7Ext', authenticate, (req, res) => {
  res.json(SpinocerebellarAtaxiaType7Ext(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.160.0', module: 'pcc_neuro_ext61', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
