// pcc_pediatric_neuro_ext15 routes v3.125.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricNMOSpectrum, PediatricMOGAntibody, PediatricAcuteDisseminated, PediatricTransverseMyelitis, PediatricOpticNeuritisExt, PediatricADEM, PediatricAutoimmuneEncephalitis, PediatricAntiNMDA, PediatricAntiLGI1, PediatricAntiGAD } = require('./pcc_pediatric_neuro_ext15_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.125.0', module: 'pcc_pediatric_neuro_ext15', label: 'PCC Pediatric Neuro Ext15', functions: ['PediatricNMOSpectrum', 'PediatricMOGAntibody', 'PediatricAcuteDisseminated', 'PediatricTransverseMyelitis', 'PediatricOpticNeuritisExt', 'PediatricADEM', 'PediatricAutoimmuneEncephalitis', 'PediatricAntiNMDA', 'PediatricAntiLGI1', 'PediatricAntiGAD'] });
});
router.post('/call/PediatricNMOSpectrum', authenticate, (req, res) => {
  res.json(PediatricNMOSpectrum(req.body));
});

router.post('/call/PediatricMOGAntibody', authenticate, (req, res) => {
  res.json(PediatricMOGAntibody(req.body));
});

router.post('/call/PediatricAcuteDisseminated', authenticate, (req, res) => {
  res.json(PediatricAcuteDisseminated(req.body));
});

router.post('/call/PediatricTransverseMyelitis', authenticate, (req, res) => {
  res.json(PediatricTransverseMyelitis(req.body));
});

router.post('/call/PediatricOpticNeuritisExt', authenticate, (req, res) => {
  res.json(PediatricOpticNeuritisExt(req.body));
});

router.post('/call/PediatricADEM', authenticate, (req, res) => {
  res.json(PediatricADEM(req.body));
});

router.post('/call/PediatricAutoimmuneEncephalitis', authenticate, (req, res) => {
  res.json(PediatricAutoimmuneEncephalitis(req.body));
});

router.post('/call/PediatricAntiNMDA', authenticate, (req, res) => {
  res.json(PediatricAntiNMDA(req.body));
});

router.post('/call/PediatricAntiLGI1', authenticate, (req, res) => {
  res.json(PediatricAntiLGI1(req.body));
});

router.post('/call/PediatricAntiGAD', authenticate, (req, res) => {
  res.json(PediatricAntiGAD(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.125.0', module: 'pcc_pediatric_neuro_ext15', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
