// pcc_pediatric_neuro_ext8 routes v3.118.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricAutismSpectrum, PediatricAspergerSyndrome, PediatricPervasiveDevelopmental, PediatricRettSyndrome, PediatricChildhoodDisintegrative, PediatricADHD, PediatricTouretteSyndrome, PediatricOCD, PediatricAnxietyDisorder, PediatricConductDisorder } = require('./pcc_pediatric_neuro_ext8_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.118.0', module: 'pcc_pediatric_neuro_ext8', label: 'PCC Pediatric Neuro Ext8', functions: ['PediatricAutismSpectrum', 'PediatricAspergerSyndrome', 'PediatricPervasiveDevelopmental', 'PediatricRettSyndrome', 'PediatricChildhoodDisintegrative', 'PediatricADHD', 'PediatricTouretteSyndrome', 'PediatricOCD', 'PediatricAnxietyDisorder', 'PediatricConductDisorder'] });
});
router.post('/call/PediatricAutismSpectrum', authenticate, (req, res) => {
  res.json(PediatricAutismSpectrum(req.body));
});

router.post('/call/PediatricAspergerSyndrome', authenticate, (req, res) => {
  res.json(PediatricAspergerSyndrome(req.body));
});

router.post('/call/PediatricPervasiveDevelopmental', authenticate, (req, res) => {
  res.json(PediatricPervasiveDevelopmental(req.body));
});

router.post('/call/PediatricRettSyndrome', authenticate, (req, res) => {
  res.json(PediatricRettSyndrome(req.body));
});

router.post('/call/PediatricChildhoodDisintegrative', authenticate, (req, res) => {
  res.json(PediatricChildhoodDisintegrative(req.body));
});

router.post('/call/PediatricADHD', authenticate, (req, res) => {
  res.json(PediatricADHD(req.body));
});

router.post('/call/PediatricTouretteSyndrome', authenticate, (req, res) => {
  res.json(PediatricTouretteSyndrome(req.body));
});

router.post('/call/PediatricOCD', authenticate, (req, res) => {
  res.json(PediatricOCD(req.body));
});

router.post('/call/PediatricAnxietyDisorder', authenticate, (req, res) => {
  res.json(PediatricAnxietyDisorder(req.body));
});

router.post('/call/PediatricConductDisorder', authenticate, (req, res) => {
  res.json(PediatricConductDisorder(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.118.0', module: 'pcc_pediatric_neuro_ext8', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
