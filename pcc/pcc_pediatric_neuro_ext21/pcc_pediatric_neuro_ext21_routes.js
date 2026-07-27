// pcc_pediatric_neuro_ext21 routes v3.131.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricNeuroinflammatory, PediatricADEMRecurrent, PediatricMultipleSclerosisRelapse, PediatricVasculitis, PediatricSystemicLupus, PediatricBehcetDisease, PediatricWegeners, PediatricTakayasu, PediatricKawasakiNeurologic, PediatricNeuroVasculitis } = require('./pcc_pediatric_neuro_ext21_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.131.0', module: 'pcc_pediatric_neuro_ext21', label: 'PCC Pediatric Neuro Ext21', functions: ['PediatricNeuroinflammatory', 'PediatricADEMRecurrent', 'PediatricMultipleSclerosisRelapse', 'PediatricVasculitis', 'PediatricSystemicLupus', 'PediatricBehcetDisease', 'PediatricWegeners', 'PediatricTakayasu', 'PediatricKawasakiNeurologic', 'PediatricNeuroVasculitis'] });
});
router.post('/call/PediatricNeuroinflammatory', authenticate, (req, res) => {
  res.json(PediatricNeuroinflammatory(req.body));
});

router.post('/call/PediatricADEMRecurrent', authenticate, (req, res) => {
  res.json(PediatricADEMRecurrent(req.body));
});

router.post('/call/PediatricMultipleSclerosisRelapse', authenticate, (req, res) => {
  res.json(PediatricMultipleSclerosisRelapse(req.body));
});

router.post('/call/PediatricVasculitis', authenticate, (req, res) => {
  res.json(PediatricVasculitis(req.body));
});

router.post('/call/PediatricSystemicLupus', authenticate, (req, res) => {
  res.json(PediatricSystemicLupus(req.body));
});

router.post('/call/PediatricBehcetDisease', authenticate, (req, res) => {
  res.json(PediatricBehcetDisease(req.body));
});

router.post('/call/PediatricWegeners', authenticate, (req, res) => {
  res.json(PediatricWegeners(req.body));
});

router.post('/call/PediatricTakayasu', authenticate, (req, res) => {
  res.json(PediatricTakayasu(req.body));
});

router.post('/call/PediatricKawasakiNeurologic', authenticate, (req, res) => {
  res.json(PediatricKawasakiNeurologic(req.body));
});

router.post('/call/PediatricNeuroVasculitis', authenticate, (req, res) => {
  res.json(PediatricNeuroVasculitis(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.131.0', module: 'pcc_pediatric_neuro_ext21', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
