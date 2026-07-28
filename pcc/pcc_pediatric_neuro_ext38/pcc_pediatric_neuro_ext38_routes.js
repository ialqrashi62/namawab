// pcc_pediatric_neuro_ext38 routes v3.148.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricBrainTumorSyndromeExt, PediatricNeurofibromatosisBrainTumorExt, PediatricTuberousSclerosisBrainTumorExt, PediatricVonHippelLindauBrainTumorExt, PediatricLiFraumeniBrainTumorExt, PediatricGorlinBrainTumorExt, PediatricRetinoblastomaBrainTumorExt, PediatricAtypicalTeratoidExt, PediatricEmbryonalTumorExt, PediatricPineoblastomaExt } = require('./pcc_pediatric_neuro_ext38_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.148.0', module: 'pcc_pediatric_neuro_ext38', label: 'PCC Pediatric Neuro Ext38', functions: ['PediatricBrainTumorSyndromeExt', 'PediatricNeurofibromatosisBrainTumorExt', 'PediatricTuberousSclerosisBrainTumorExt', 'PediatricVonHippelLindauBrainTumorExt', 'PediatricLiFraumeniBrainTumorExt', 'PediatricGorlinBrainTumorExt', 'PediatricRetinoblastomaBrainTumorExt', 'PediatricAtypicalTeratoidExt', 'PediatricEmbryonalTumorExt', 'PediatricPineoblastomaExt'] });
});
router.post('/call/PediatricBrainTumorSyndromeExt', authenticate, (req, res) => {
  res.json(PediatricBrainTumorSyndromeExt(req.body));
});

router.post('/call/PediatricNeurofibromatosisBrainTumorExt', authenticate, (req, res) => {
  res.json(PediatricNeurofibromatosisBrainTumorExt(req.body));
});

router.post('/call/PediatricTuberousSclerosisBrainTumorExt', authenticate, (req, res) => {
  res.json(PediatricTuberousSclerosisBrainTumorExt(req.body));
});

router.post('/call/PediatricVonHippelLindauBrainTumorExt', authenticate, (req, res) => {
  res.json(PediatricVonHippelLindauBrainTumorExt(req.body));
});

router.post('/call/PediatricLiFraumeniBrainTumorExt', authenticate, (req, res) => {
  res.json(PediatricLiFraumeniBrainTumorExt(req.body));
});

router.post('/call/PediatricGorlinBrainTumorExt', authenticate, (req, res) => {
  res.json(PediatricGorlinBrainTumorExt(req.body));
});

router.post('/call/PediatricRetinoblastomaBrainTumorExt', authenticate, (req, res) => {
  res.json(PediatricRetinoblastomaBrainTumorExt(req.body));
});

router.post('/call/PediatricAtypicalTeratoidExt', authenticate, (req, res) => {
  res.json(PediatricAtypicalTeratoidExt(req.body));
});

router.post('/call/PediatricEmbryonalTumorExt', authenticate, (req, res) => {
  res.json(PediatricEmbryonalTumorExt(req.body));
});

router.post('/call/PediatricPineoblastomaExt', authenticate, (req, res) => {
  res.json(PediatricPineoblastomaExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.148.0', module: 'pcc_pediatric_neuro_ext38', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
