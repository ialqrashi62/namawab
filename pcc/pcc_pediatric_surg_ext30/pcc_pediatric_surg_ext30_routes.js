// pcc_pediatric_surg_ext30 routes v3.140.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricOncologySurgeryExt, PediatricNeuroblastomaExt, PediatricWilmsTumorExt, PediatricHepatoblastomaExt, PediatricRhabdomyosarcomaExt, PediatricOsteosarcomaExt, PediatricEwingSarcomaExt, PediatricRetinoblastomaExt, PediatricBrainTumorExt, PediatricLymphomaSurgeryExt } = require('./pcc_pediatric_surg_ext30_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.140.0', module: 'pcc_pediatric_surg_ext30', label: 'PCC Pediatric Surg Ext30', functions: ['PediatricOncologySurgeryExt', 'PediatricNeuroblastomaExt', 'PediatricWilmsTumorExt', 'PediatricHepatoblastomaExt', 'PediatricRhabdomyosarcomaExt', 'PediatricOsteosarcomaExt', 'PediatricEwingSarcomaExt', 'PediatricRetinoblastomaExt', 'PediatricBrainTumorExt', 'PediatricLymphomaSurgeryExt'] });
});
router.post('/call/PediatricOncologySurgeryExt', authenticate, (req, res) => {
  res.json(PediatricOncologySurgeryExt(req.body));
});

router.post('/call/PediatricNeuroblastomaExt', authenticate, (req, res) => {
  res.json(PediatricNeuroblastomaExt(req.body));
});

router.post('/call/PediatricWilmsTumorExt', authenticate, (req, res) => {
  res.json(PediatricWilmsTumorExt(req.body));
});

router.post('/call/PediatricHepatoblastomaExt', authenticate, (req, res) => {
  res.json(PediatricHepatoblastomaExt(req.body));
});

router.post('/call/PediatricRhabdomyosarcomaExt', authenticate, (req, res) => {
  res.json(PediatricRhabdomyosarcomaExt(req.body));
});

router.post('/call/PediatricOsteosarcomaExt', authenticate, (req, res) => {
  res.json(PediatricOsteosarcomaExt(req.body));
});

router.post('/call/PediatricEwingSarcomaExt', authenticate, (req, res) => {
  res.json(PediatricEwingSarcomaExt(req.body));
});

router.post('/call/PediatricRetinoblastomaExt', authenticate, (req, res) => {
  res.json(PediatricRetinoblastomaExt(req.body));
});

router.post('/call/PediatricBrainTumorExt', authenticate, (req, res) => {
  res.json(PediatricBrainTumorExt(req.body));
});

router.post('/call/PediatricLymphomaSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricLymphomaSurgeryExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.140.0', module: 'pcc_pediatric_surg_ext30', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
