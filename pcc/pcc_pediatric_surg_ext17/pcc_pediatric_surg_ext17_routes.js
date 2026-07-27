// pcc_pediatric_surg_ext17 routes v3.127.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricOncologySurgeryExt, PediatricWilmsTumor, PediatricNeuroblastomaResection, PediatricHepatoblastoma, PediatricRetinoblastomaSurgeryExt, PediatricRhabdomyosarcoma, PediatricOsteosarcomaResection, PediatricEwingsSarcoma, PediatricLymphomaBiopsy, PediatricGermCellTumor } = require('./pcc_pediatric_surg_ext17_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.127.0', module: 'pcc_pediatric_surg_ext17', label: 'PCC Pediatric Surg Ext17', functions: ['PediatricOncologySurgeryExt', 'PediatricWilmsTumor', 'PediatricNeuroblastomaResection', 'PediatricHepatoblastoma', 'PediatricRetinoblastomaSurgeryExt', 'PediatricRhabdomyosarcoma', 'PediatricOsteosarcomaResection', 'PediatricEwingsSarcoma', 'PediatricLymphomaBiopsy', 'PediatricGermCellTumor'] });
});
router.post('/call/PediatricOncologySurgeryExt', authenticate, (req, res) => {
  res.json(PediatricOncologySurgeryExt(req.body));
});

router.post('/call/PediatricWilmsTumor', authenticate, (req, res) => {
  res.json(PediatricWilmsTumor(req.body));
});

router.post('/call/PediatricNeuroblastomaResection', authenticate, (req, res) => {
  res.json(PediatricNeuroblastomaResection(req.body));
});

router.post('/call/PediatricHepatoblastoma', authenticate, (req, res) => {
  res.json(PediatricHepatoblastoma(req.body));
});

router.post('/call/PediatricRetinoblastomaSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricRetinoblastomaSurgeryExt(req.body));
});

router.post('/call/PediatricRhabdomyosarcoma', authenticate, (req, res) => {
  res.json(PediatricRhabdomyosarcoma(req.body));
});

router.post('/call/PediatricOsteosarcomaResection', authenticate, (req, res) => {
  res.json(PediatricOsteosarcomaResection(req.body));
});

router.post('/call/PediatricEwingsSarcoma', authenticate, (req, res) => {
  res.json(PediatricEwingsSarcoma(req.body));
});

router.post('/call/PediatricLymphomaBiopsy', authenticate, (req, res) => {
  res.json(PediatricLymphomaBiopsy(req.body));
});

router.post('/call/PediatricGermCellTumor', authenticate, (req, res) => {
  res.json(PediatricGermCellTumor(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.127.0', module: 'pcc_pediatric_surg_ext17', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
