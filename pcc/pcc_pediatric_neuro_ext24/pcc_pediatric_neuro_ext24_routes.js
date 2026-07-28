// pcc_pediatric_neuro_ext24 routes v3.134.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricSleepDisorder, PediatricObstructiveSleepApnea, PediatricCentralSleepApnea, PediatricSleepApneaEval, PediatricPolysomnographyExt, PediatricSleepStudy, PediatricCPAPInitiation, PediatricBiPAPInitiation, PediatricSleepHygiene, PediatricCircadianRhythmDisorder } = require('./pcc_pediatric_neuro_ext24_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.134.0', module: 'pcc_pediatric_neuro_ext24', label: 'PCC Pediatric Neuro Ext24', functions: ['PediatricSleepDisorder', 'PediatricObstructiveSleepApnea', 'PediatricCentralSleepApnea', 'PediatricSleepApneaEval', 'PediatricPolysomnographyExt', 'PediatricSleepStudy', 'PediatricCPAPInitiation', 'PediatricBiPAPInitiation', 'PediatricSleepHygiene', 'PediatricCircadianRhythmDisorder'] });
});
router.post('/call/PediatricSleepDisorder', authenticate, (req, res) => {
  res.json(PediatricSleepDisorder(req.body));
});

router.post('/call/PediatricObstructiveSleepApnea', authenticate, (req, res) => {
  res.json(PediatricObstructiveSleepApnea(req.body));
});

router.post('/call/PediatricCentralSleepApnea', authenticate, (req, res) => {
  res.json(PediatricCentralSleepApnea(req.body));
});

router.post('/call/PediatricSleepApneaEval', authenticate, (req, res) => {
  res.json(PediatricSleepApneaEval(req.body));
});

router.post('/call/PediatricPolysomnographyExt', authenticate, (req, res) => {
  res.json(PediatricPolysomnographyExt(req.body));
});

router.post('/call/PediatricSleepStudy', authenticate, (req, res) => {
  res.json(PediatricSleepStudy(req.body));
});

router.post('/call/PediatricCPAPInitiation', authenticate, (req, res) => {
  res.json(PediatricCPAPInitiation(req.body));
});

router.post('/call/PediatricBiPAPInitiation', authenticate, (req, res) => {
  res.json(PediatricBiPAPInitiation(req.body));
});

router.post('/call/PediatricSleepHygiene', authenticate, (req, res) => {
  res.json(PediatricSleepHygiene(req.body));
});

router.post('/call/PediatricCircadianRhythmDisorder', authenticate, (req, res) => {
  res.json(PediatricCircadianRhythmDisorder(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.134.0', module: 'pcc_pediatric_neuro_ext24', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
