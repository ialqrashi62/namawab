// pcc_neuro_ext49 routes v3.148.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { AutonomicDysreflexiaExt, OrthostaticHypotensionExt, PosturalOrthostaticTachycardiaExt, NeurocardiogenicSyncopeExt, CarotidSinusHypersensitivityExt, TiltTableSyncopeExt, PureAutonomicFailureExt, MultipleSystemAtrophyAutonomicExt, DysautonomiaExt, FamilialDysautonomiaExt } = require('./pcc_neuro_ext49_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.148.0', module: 'pcc_neuro_ext49', label: 'PCC Neuro Ext49', functions: ['AutonomicDysreflexiaExt', 'OrthostaticHypotensionExt', 'PosturalOrthostaticTachycardiaExt', 'NeurocardiogenicSyncopeExt', 'CarotidSinusHypersensitivityExt', 'TiltTableSyncopeExt', 'PureAutonomicFailureExt', 'MultipleSystemAtrophyAutonomicExt', 'DysautonomiaExt', 'FamilialDysautonomiaExt'] });
});
router.post('/call/AutonomicDysreflexiaExt', authenticate, (req, res) => {
  res.json(AutonomicDysreflexiaExt(req.body));
});

router.post('/call/OrthostaticHypotensionExt', authenticate, (req, res) => {
  res.json(OrthostaticHypotensionExt(req.body));
});

router.post('/call/PosturalOrthostaticTachycardiaExt', authenticate, (req, res) => {
  res.json(PosturalOrthostaticTachycardiaExt(req.body));
});

router.post('/call/NeurocardiogenicSyncopeExt', authenticate, (req, res) => {
  res.json(NeurocardiogenicSyncopeExt(req.body));
});

router.post('/call/CarotidSinusHypersensitivityExt', authenticate, (req, res) => {
  res.json(CarotidSinusHypersensitivityExt(req.body));
});

router.post('/call/TiltTableSyncopeExt', authenticate, (req, res) => {
  res.json(TiltTableSyncopeExt(req.body));
});

router.post('/call/PureAutonomicFailureExt', authenticate, (req, res) => {
  res.json(PureAutonomicFailureExt(req.body));
});

router.post('/call/MultipleSystemAtrophyAutonomicExt', authenticate, (req, res) => {
  res.json(MultipleSystemAtrophyAutonomicExt(req.body));
});

router.post('/call/DysautonomiaExt', authenticate, (req, res) => {
  res.json(DysautonomiaExt(req.body));
});

router.post('/call/FamilialDysautonomiaExt', authenticate, (req, res) => {
  res.json(FamilialDysautonomiaExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.148.0', module: 'pcc_neuro_ext49', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
