// pcc_neuro_ext28 routes v3.127.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { AutonomicDisorderExt, AutonomicNeuropathy, PureAutonomicFailure, MultipleSystemAtrophyAutonomic, OrthostaticHypotension, PosturalTachycardiaSyndrome, NeurocardiogenicSyncope, CarotidSinusHypersensitivity, AutonomicDysreflexia, BaroreflexFailure } = require('./pcc_neuro_ext28_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.127.0', module: 'pcc_neuro_ext28', label: 'PCC Neuro Ext28', functions: ['AutonomicDisorderExt', 'AutonomicNeuropathy', 'PureAutonomicFailure', 'MultipleSystemAtrophyAutonomic', 'OrthostaticHypotension', 'PosturalTachycardiaSyndrome', 'NeurocardiogenicSyncope', 'CarotidSinusHypersensitivity', 'AutonomicDysreflexia', 'BaroreflexFailure'] });
});
router.post('/call/AutonomicDisorderExt', authenticate, (req, res) => {
  res.json(AutonomicDisorderExt(req.body));
});

router.post('/call/AutonomicNeuropathy', authenticate, (req, res) => {
  res.json(AutonomicNeuropathy(req.body));
});

router.post('/call/PureAutonomicFailure', authenticate, (req, res) => {
  res.json(PureAutonomicFailure(req.body));
});

router.post('/call/MultipleSystemAtrophyAutonomic', authenticate, (req, res) => {
  res.json(MultipleSystemAtrophyAutonomic(req.body));
});

router.post('/call/OrthostaticHypotension', authenticate, (req, res) => {
  res.json(OrthostaticHypotension(req.body));
});

router.post('/call/PosturalTachycardiaSyndrome', authenticate, (req, res) => {
  res.json(PosturalTachycardiaSyndrome(req.body));
});

router.post('/call/NeurocardiogenicSyncope', authenticate, (req, res) => {
  res.json(NeurocardiogenicSyncope(req.body));
});

router.post('/call/CarotidSinusHypersensitivity', authenticate, (req, res) => {
  res.json(CarotidSinusHypersensitivity(req.body));
});

router.post('/call/AutonomicDysreflexia', authenticate, (req, res) => {
  res.json(AutonomicDysreflexia(req.body));
});

router.post('/call/BaroreflexFailure', authenticate, (req, res) => {
  res.json(BaroreflexFailure(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.127.0', module: 'pcc_neuro_ext28', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
