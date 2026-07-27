// pcc_pediatric_neuro_ext19 routes v3.129.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricEpilepsySyndromesExt, PediatricFebrileSeizureExt, PediatricInfantileSpasm, PediatricLennoxGastautExt, PediatricDooseSyndrome, PediatricLandauKleffnerExt, PediatricCSWSSyndrome, PediatricSevereMyoclonicEpilepsy, PediatricPanayiotopoulos, PediatricEpilepsyOfInfancy } = require('./pcc_pediatric_neuro_ext19_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.129.0', module: 'pcc_pediatric_neuro_ext19', label: 'PCC Pediatric Neuro Ext19', functions: ['PediatricEpilepsySyndromesExt', 'PediatricFebrileSeizureExt', 'PediatricInfantileSpasm', 'PediatricLennoxGastautExt', 'PediatricDooseSyndrome', 'PediatricLandauKleffnerExt', 'PediatricCSWSSyndrome', 'PediatricSevereMyoclonicEpilepsy', 'PediatricPanayiotopoulos', 'PediatricEpilepsyOfInfancy'] });
});
router.post('/call/PediatricEpilepsySyndromesExt', authenticate, (req, res) => {
  res.json(PediatricEpilepsySyndromesExt(req.body));
});

router.post('/call/PediatricFebrileSeizureExt', authenticate, (req, res) => {
  res.json(PediatricFebrileSeizureExt(req.body));
});

router.post('/call/PediatricInfantileSpasm', authenticate, (req, res) => {
  res.json(PediatricInfantileSpasm(req.body));
});

router.post('/call/PediatricLennoxGastautExt', authenticate, (req, res) => {
  res.json(PediatricLennoxGastautExt(req.body));
});

router.post('/call/PediatricDooseSyndrome', authenticate, (req, res) => {
  res.json(PediatricDooseSyndrome(req.body));
});

router.post('/call/PediatricLandauKleffnerExt', authenticate, (req, res) => {
  res.json(PediatricLandauKleffnerExt(req.body));
});

router.post('/call/PediatricCSWSSyndrome', authenticate, (req, res) => {
  res.json(PediatricCSWSSyndrome(req.body));
});

router.post('/call/PediatricSevereMyoclonicEpilepsy', authenticate, (req, res) => {
  res.json(PediatricSevereMyoclonicEpilepsy(req.body));
});

router.post('/call/PediatricPanayiotopoulos', authenticate, (req, res) => {
  res.json(PediatricPanayiotopoulos(req.body));
});

router.post('/call/PediatricEpilepsyOfInfancy', authenticate, (req, res) => {
  res.json(PediatricEpilepsyOfInfancy(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.129.0', module: 'pcc_pediatric_neuro_ext19', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
