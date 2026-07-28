// pcc_pediatric_surg_ext35 routes v3.145.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricENTTumorExt, PediatricThyroidectomyExt, PediatricParathyroidectomyExt, PediatricSalivaryGlandExt, PediatricCervicalLymphNodeExt, PediatricBranchialCleftExt, PediatricThyroglossalDuctExt, PediatricCysticHygromaExt, PediatricDermoidCystExt, PediatricLingualThyroidExt } = require('./pcc_pediatric_surg_ext35_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.145.0', module: 'pcc_pediatric_surg_ext35', label: 'PCC Pediatric Surg Ext35', functions: ['PediatricENTTumorExt', 'PediatricThyroidectomyExt', 'PediatricParathyroidectomyExt', 'PediatricSalivaryGlandExt', 'PediatricCervicalLymphNodeExt', 'PediatricBranchialCleftExt', 'PediatricThyroglossalDuctExt', 'PediatricCysticHygromaExt', 'PediatricDermoidCystExt', 'PediatricLingualThyroidExt'] });
});
router.post('/call/PediatricENTTumorExt', authenticate, (req, res) => {
  res.json(PediatricENTTumorExt(req.body));
});

router.post('/call/PediatricThyroidectomyExt', authenticate, (req, res) => {
  res.json(PediatricThyroidectomyExt(req.body));
});

router.post('/call/PediatricParathyroidectomyExt', authenticate, (req, res) => {
  res.json(PediatricParathyroidectomyExt(req.body));
});

router.post('/call/PediatricSalivaryGlandExt', authenticate, (req, res) => {
  res.json(PediatricSalivaryGlandExt(req.body));
});

router.post('/call/PediatricCervicalLymphNodeExt', authenticate, (req, res) => {
  res.json(PediatricCervicalLymphNodeExt(req.body));
});

router.post('/call/PediatricBranchialCleftExt', authenticate, (req, res) => {
  res.json(PediatricBranchialCleftExt(req.body));
});

router.post('/call/PediatricThyroglossalDuctExt', authenticate, (req, res) => {
  res.json(PediatricThyroglossalDuctExt(req.body));
});

router.post('/call/PediatricCysticHygromaExt', authenticate, (req, res) => {
  res.json(PediatricCysticHygromaExt(req.body));
});

router.post('/call/PediatricDermoidCystExt', authenticate, (req, res) => {
  res.json(PediatricDermoidCystExt(req.body));
});

router.post('/call/PediatricLingualThyroidExt', authenticate, (req, res) => {
  res.json(PediatricLingualThyroidExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.145.0', module: 'pcc_pediatric_surg_ext35', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
