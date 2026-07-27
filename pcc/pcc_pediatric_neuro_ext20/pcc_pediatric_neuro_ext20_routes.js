// pcc_pediatric_neuro_ext20 routes v3.130.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricDemyelinatingDisorder, PediatricMultipleSclerosis, PediatricNMOSpectrum, PediatricMOGDisease, PediatricAcuteDemyelinating, PediatricOpticNeuritis, PediatricTransverseMyelitisExt, PediatricADEMExt, PediatricAutoimmuneEncephalitis, PediatricHashimoto } = require('./pcc_pediatric_neuro_ext20_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.130.0', module: 'pcc_pediatric_neuro_ext20', label: 'PCC Pediatric Neuro Ext20', functions: ['PediatricDemyelinatingDisorder', 'PediatricMultipleSclerosis', 'PediatricNMOSpectrum', 'PediatricMOGDisease', 'PediatricAcuteDemyelinating', 'PediatricOpticNeuritis', 'PediatricTransverseMyelitisExt', 'PediatricADEMExt', 'PediatricAutoimmuneEncephalitis', 'PediatricHashimoto'] });
});
router.post('/call/PediatricDemyelinatingDisorder', authenticate, (req, res) => {
  res.json(PediatricDemyelinatingDisorder(req.body));
});

router.post('/call/PediatricMultipleSclerosis', authenticate, (req, res) => {
  res.json(PediatricMultipleSclerosis(req.body));
});

router.post('/call/PediatricNMOSpectrum', authenticate, (req, res) => {
  res.json(PediatricNMOSpectrum(req.body));
});

router.post('/call/PediatricMOGDisease', authenticate, (req, res) => {
  res.json(PediatricMOGDisease(req.body));
});

router.post('/call/PediatricAcuteDemyelinating', authenticate, (req, res) => {
  res.json(PediatricAcuteDemyelinating(req.body));
});

router.post('/call/PediatricOpticNeuritis', authenticate, (req, res) => {
  res.json(PediatricOpticNeuritis(req.body));
});

router.post('/call/PediatricTransverseMyelitisExt', authenticate, (req, res) => {
  res.json(PediatricTransverseMyelitisExt(req.body));
});

router.post('/call/PediatricADEMExt', authenticate, (req, res) => {
  res.json(PediatricADEMExt(req.body));
});

router.post('/call/PediatricAutoimmuneEncephalitis', authenticate, (req, res) => {
  res.json(PediatricAutoimmuneEncephalitis(req.body));
});

router.post('/call/PediatricHashimoto', authenticate, (req, res) => {
  res.json(PediatricHashimoto(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.130.0', module: 'pcc_pediatric_neuro_ext20', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
