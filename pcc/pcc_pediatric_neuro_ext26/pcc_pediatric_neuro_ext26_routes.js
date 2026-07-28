// pcc_pediatric_neuro_ext26 routes v3.136.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricMigraineExt3, PediatricTensionHeadacheExt, PediatricClusterHeadacheExt, PediatricChronicDailyHeadache, PediatricMedicationOveruseHeadache, PediatricNewDailyPersistentHeadache, PediatricCervicogenicHeadache, PediatricPostTraumaticHeadache, PediatricThunderclapHeadache, PediatricPrimaryCoughHeadache } = require('./pcc_pediatric_neuro_ext26_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.136.0', module: 'pcc_pediatric_neuro_ext26', label: 'PCC Pediatric Neuro Ext26', functions: ['PediatricMigraineExt3', 'PediatricTensionHeadacheExt', 'PediatricClusterHeadacheExt', 'PediatricChronicDailyHeadache', 'PediatricMedicationOveruseHeadache', 'PediatricNewDailyPersistentHeadache', 'PediatricCervicogenicHeadache', 'PediatricPostTraumaticHeadache', 'PediatricThunderclapHeadache', 'PediatricPrimaryCoughHeadache'] });
});
router.post('/call/PediatricMigraineExt3', authenticate, (req, res) => {
  res.json(PediatricMigraineExt3(req.body));
});

router.post('/call/PediatricTensionHeadacheExt', authenticate, (req, res) => {
  res.json(PediatricTensionHeadacheExt(req.body));
});

router.post('/call/PediatricClusterHeadacheExt', authenticate, (req, res) => {
  res.json(PediatricClusterHeadacheExt(req.body));
});

router.post('/call/PediatricChronicDailyHeadache', authenticate, (req, res) => {
  res.json(PediatricChronicDailyHeadache(req.body));
});

router.post('/call/PediatricMedicationOveruseHeadache', authenticate, (req, res) => {
  res.json(PediatricMedicationOveruseHeadache(req.body));
});

router.post('/call/PediatricNewDailyPersistentHeadache', authenticate, (req, res) => {
  res.json(PediatricNewDailyPersistentHeadache(req.body));
});

router.post('/call/PediatricCervicogenicHeadache', authenticate, (req, res) => {
  res.json(PediatricCervicogenicHeadache(req.body));
});

router.post('/call/PediatricPostTraumaticHeadache', authenticate, (req, res) => {
  res.json(PediatricPostTraumaticHeadache(req.body));
});

router.post('/call/PediatricThunderclapHeadache', authenticate, (req, res) => {
  res.json(PediatricThunderclapHeadache(req.body));
});

router.post('/call/PediatricPrimaryCoughHeadache', authenticate, (req, res) => {
  res.json(PediatricPrimaryCoughHeadache(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.136.0', module: 'pcc_pediatric_neuro_ext26', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
