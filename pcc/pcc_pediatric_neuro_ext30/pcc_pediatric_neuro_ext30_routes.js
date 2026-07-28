// pcc_pediatric_neuro_ext30 routes v3.140.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricSpinalMuscularAtrophyExt, PediatricDuchenneMuscularDystrophy, PediatricBeckerMuscularDystrophy, PediatricMyotonicDystrophyExt, PediatricFacioscapulohumeralExt, PediatricLimbGirdleExt, PediatricCongenitalMyopathyExt, PediatricMitochondrialMyopathy, PediatricInflammatoryMyopathyExt, PediatricDermatomyositisExt } = require('./pcc_pediatric_neuro_ext30_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.140.0', module: 'pcc_pediatric_neuro_ext30', label: 'PCC Pediatric Neuro Ext30', functions: ['PediatricSpinalMuscularAtrophyExt', 'PediatricDuchenneMuscularDystrophy', 'PediatricBeckerMuscularDystrophy', 'PediatricMyotonicDystrophyExt', 'PediatricFacioscapulohumeralExt', 'PediatricLimbGirdleExt', 'PediatricCongenitalMyopathyExt', 'PediatricMitochondrialMyopathy', 'PediatricInflammatoryMyopathyExt', 'PediatricDermatomyositisExt'] });
});
router.post('/call/PediatricSpinalMuscularAtrophyExt', authenticate, (req, res) => {
  res.json(PediatricSpinalMuscularAtrophyExt(req.body));
});

router.post('/call/PediatricDuchenneMuscularDystrophy', authenticate, (req, res) => {
  res.json(PediatricDuchenneMuscularDystrophy(req.body));
});

router.post('/call/PediatricBeckerMuscularDystrophy', authenticate, (req, res) => {
  res.json(PediatricBeckerMuscularDystrophy(req.body));
});

router.post('/call/PediatricMyotonicDystrophyExt', authenticate, (req, res) => {
  res.json(PediatricMyotonicDystrophyExt(req.body));
});

router.post('/call/PediatricFacioscapulohumeralExt', authenticate, (req, res) => {
  res.json(PediatricFacioscapulohumeralExt(req.body));
});

router.post('/call/PediatricLimbGirdleExt', authenticate, (req, res) => {
  res.json(PediatricLimbGirdleExt(req.body));
});

router.post('/call/PediatricCongenitalMyopathyExt', authenticate, (req, res) => {
  res.json(PediatricCongenitalMyopathyExt(req.body));
});

router.post('/call/PediatricMitochondrialMyopathy', authenticate, (req, res) => {
  res.json(PediatricMitochondrialMyopathy(req.body));
});

router.post('/call/PediatricInflammatoryMyopathyExt', authenticate, (req, res) => {
  res.json(PediatricInflammatoryMyopathyExt(req.body));
});

router.post('/call/PediatricDermatomyositisExt', authenticate, (req, res) => {
  res.json(PediatricDermatomyositisExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.140.0', module: 'pcc_pediatric_neuro_ext30', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
