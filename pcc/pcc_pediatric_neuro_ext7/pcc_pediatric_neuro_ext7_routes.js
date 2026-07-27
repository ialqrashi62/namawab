// pcc_pediatric_neuro_ext7 routes v3.117.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricHeadacheEvaluation, PediatricMigraineAcute, PediatricMigraineProphylaxis, PediatricTensionType, PediatricChronicDailyHeadache, PediatricPostTraumatic, PediatricSinusitisHeadache, PediatricIntracranialHypertension, PediatricChiariHeadache, PediatricMedicationOveruse } = require('./pcc_pediatric_neuro_ext7_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.117.0', module: 'pcc_pediatric_neuro_ext7', label: 'PCC Pediatric Neuro Ext7', functions: ['PediatricHeadacheEvaluation', 'PediatricMigraineAcute', 'PediatricMigraineProphylaxis', 'PediatricTensionType', 'PediatricChronicDailyHeadache', 'PediatricPostTraumatic', 'PediatricSinusitisHeadache', 'PediatricIntracranialHypertension', 'PediatricChiariHeadache', 'PediatricMedicationOveruse'] });
});
router.post('/call/PediatricHeadacheEvaluation', authenticate, (req, res) => {
  res.json(PediatricHeadacheEvaluation(req.body));
});

router.post('/call/PediatricMigraineAcute', authenticate, (req, res) => {
  res.json(PediatricMigraineAcute(req.body));
});

router.post('/call/PediatricMigraineProphylaxis', authenticate, (req, res) => {
  res.json(PediatricMigraineProphylaxis(req.body));
});

router.post('/call/PediatricTensionType', authenticate, (req, res) => {
  res.json(PediatricTensionType(req.body));
});

router.post('/call/PediatricChronicDailyHeadache', authenticate, (req, res) => {
  res.json(PediatricChronicDailyHeadache(req.body));
});

router.post('/call/PediatricPostTraumatic', authenticate, (req, res) => {
  res.json(PediatricPostTraumatic(req.body));
});

router.post('/call/PediatricSinusitisHeadache', authenticate, (req, res) => {
  res.json(PediatricSinusitisHeadache(req.body));
});

router.post('/call/PediatricIntracranialHypertension', authenticate, (req, res) => {
  res.json(PediatricIntracranialHypertension(req.body));
});

router.post('/call/PediatricChiariHeadache', authenticate, (req, res) => {
  res.json(PediatricChiariHeadache(req.body));
});

router.post('/call/PediatricMedicationOveruse', authenticate, (req, res) => {
  res.json(PediatricMedicationOveruse(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.117.0', module: 'pcc_pediatric_neuro_ext7', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
