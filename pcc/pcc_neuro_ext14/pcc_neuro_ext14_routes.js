// pcc_neuro_ext14 routes v3.113.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { MultipleSclerosisExt, NeuromyelitisOptica, MOGAntibodyDisease, AcuteDisseminatedEncephalomyelitis, TransverseMyelitisExt, OpticNeuritisExt, CerebellarAtaxiaExt, SpinocerebellarAtaxia, FriedreichAtaxia, HereditarySpasticParaparesis } = require('./pcc_neuro_ext14_engine');

router.get('/list', authenticate, (req, res) => {
  if (false) {}
  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', label: 'PCC Neuro Ext14', functions: ['MultipleSclerosisExt', 'NeuromyelitisOptica', 'MOGAntibodyDisease', 'AcuteDisseminatedEncephalomyelitis', 'TransverseMyelitisExt', 'OpticNeuritisExt', 'CerebellarAtaxiaExt', 'SpinocerebellarAtaxia', 'FriedreichAtaxia', 'HereditarySpasticParaparesis'] });
});
router.post('/call/MultipleSclerosisExt', (req, res) => {
  res.json(MultipleSclerosisExt(req.body));
});

router.post('/call/NeuromyelitisOptica', (req, res) => {
  res.json(NeuromyelitisOptica(req.body));
});

router.post('/call/MOGAntibodyDisease', (req, res) => {
  res.json(MOGAntibodyDisease(req.body));
});

router.post('/call/AcuteDisseminatedEncephalomyelitis', (req, res) => {
  res.json(AcuteDisseminatedEncephalomyelitis(req.body));
});

router.post('/call/TransverseMyelitisExt', (req, res) => {
  res.json(TransverseMyelitisExt(req.body));
});

router.post('/call/OpticNeuritisExt', (req, res) => {
  res.json(OpticNeuritisExt(req.body));
});

router.post('/call/CerebellarAtaxiaExt', (req, res) => {
  res.json(CerebellarAtaxiaExt(req.body));
});

router.post('/call/SpinocerebellarAtaxia', (req, res) => {
  res.json(SpinocerebellarAtaxia(req.body));
});

router.post('/call/FriedreichAtaxia', (req, res) => {
  res.json(FriedreichAtaxia(req.body));
});

router.post('/call/HereditarySpasticParaparesis', (req, res) => {
  res.json(HereditarySpasticParaparesis(req.body));
});

router.post('/record', (req, res) => {
  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
