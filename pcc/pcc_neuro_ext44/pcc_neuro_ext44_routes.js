// pcc_neuro_ext44 routes v3.143.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { SpinocerebellarAtaxiaExt, FriedreichAtaxiaExt, AtaxiaTelangiectasiaExt, EpisodicAtaxiaExt, CerebellarDegenerationExt, OlivopontocerebellarAtrophyExt, DentatorubralPallidoluysianExt, MachadoJosephExt, IdiopathicCerebellarAtaxiaExt, CerebellitisExt } = require('./pcc_neuro_ext44_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.143.0', module: 'pcc_neuro_ext44', label: 'PCC Neuro Ext44', functions: ['SpinocerebellarAtaxiaExt', 'FriedreichAtaxiaExt', 'AtaxiaTelangiectasiaExt', 'EpisodicAtaxiaExt', 'CerebellarDegenerationExt', 'OlivopontocerebellarAtrophyExt', 'DentatorubralPallidoluysianExt', 'MachadoJosephExt', 'IdiopathicCerebellarAtaxiaExt', 'CerebellitisExt'] });
});
router.post('/call/SpinocerebellarAtaxiaExt', authenticate, (req, res) => {
  res.json(SpinocerebellarAtaxiaExt(req.body));
});

router.post('/call/FriedreichAtaxiaExt', authenticate, (req, res) => {
  res.json(FriedreichAtaxiaExt(req.body));
});

router.post('/call/AtaxiaTelangiectasiaExt', authenticate, (req, res) => {
  res.json(AtaxiaTelangiectasiaExt(req.body));
});

router.post('/call/EpisodicAtaxiaExt', authenticate, (req, res) => {
  res.json(EpisodicAtaxiaExt(req.body));
});

router.post('/call/CerebellarDegenerationExt', authenticate, (req, res) => {
  res.json(CerebellarDegenerationExt(req.body));
});

router.post('/call/OlivopontocerebellarAtrophyExt', authenticate, (req, res) => {
  res.json(OlivopontocerebellarAtrophyExt(req.body));
});

router.post('/call/DentatorubralPallidoluysianExt', authenticate, (req, res) => {
  res.json(DentatorubralPallidoluysianExt(req.body));
});

router.post('/call/MachadoJosephExt', authenticate, (req, res) => {
  res.json(MachadoJosephExt(req.body));
});

router.post('/call/IdiopathicCerebellarAtaxiaExt', authenticate, (req, res) => {
  res.json(IdiopathicCerebellarAtaxiaExt(req.body));
});

router.post('/call/CerebellitisExt', authenticate, (req, res) => {
  res.json(CerebellitisExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.143.0', module: 'pcc_neuro_ext44', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
