// pcc_neuro_ext43 routes v3.142.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { AdultHydrocephalusExt, NormalPressureHydrocephalusExt, CommunicatingHydrocephalusExt, NonCommunicatingHydrocephalusExt, ArrestedHydrocephalusExt, ExVacuoDilatationExt, CSFLeakExt, IntracranialHypotensionExt, PseudotumorCerebriExt2, CSFVenousFistulaExt } = require('./pcc_neuro_ext43_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.142.0', module: 'pcc_neuro_ext43', label: 'PCC Neuro Ext43', functions: ['AdultHydrocephalusExt', 'NormalPressureHydrocephalusExt', 'CommunicatingHydrocephalusExt', 'NonCommunicatingHydrocephalusExt', 'ArrestedHydrocephalusExt', 'ExVacuoDilatationExt', 'CSFLeakExt', 'IntracranialHypotensionExt', 'PseudotumorCerebriExt2', 'CSFVenousFistulaExt'] });
});
router.post('/call/AdultHydrocephalusExt', authenticate, (req, res) => {
  res.json(AdultHydrocephalusExt(req.body));
});

router.post('/call/NormalPressureHydrocephalusExt', authenticate, (req, res) => {
  res.json(NormalPressureHydrocephalusExt(req.body));
});

router.post('/call/CommunicatingHydrocephalusExt', authenticate, (req, res) => {
  res.json(CommunicatingHydrocephalusExt(req.body));
});

router.post('/call/NonCommunicatingHydrocephalusExt', authenticate, (req, res) => {
  res.json(NonCommunicatingHydrocephalusExt(req.body));
});

router.post('/call/ArrestedHydrocephalusExt', authenticate, (req, res) => {
  res.json(ArrestedHydrocephalusExt(req.body));
});

router.post('/call/ExVacuoDilatationExt', authenticate, (req, res) => {
  res.json(ExVacuoDilatationExt(req.body));
});

router.post('/call/CSFLeakExt', authenticate, (req, res) => {
  res.json(CSFLeakExt(req.body));
});

router.post('/call/IntracranialHypotensionExt', authenticate, (req, res) => {
  res.json(IntracranialHypotensionExt(req.body));
});

router.post('/call/PseudotumorCerebriExt2', authenticate, (req, res) => {
  res.json(PseudotumorCerebriExt2(req.body));
});

router.post('/call/CSFVenousFistulaExt', authenticate, (req, res) => {
  res.json(CSFVenousFistulaExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.142.0', module: 'pcc_neuro_ext43', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
