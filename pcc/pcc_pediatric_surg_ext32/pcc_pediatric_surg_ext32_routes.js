// pcc_pediatric_surg_ext32 routes v3.142.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricUrologyExt3, PediatricPyeloplastyExt, PediatricUreteralReimplantExt, PediatricHypospadiasRepairExt, PediatricEpispadiasRepairExt, PediatricBladderExstrophyExt, PediatricCloacalExstrophyExt, PediatricPosteriorUrethralValvesExt, PediatricNephrectomyExt, PediatricPartialNephrectomyExt } = require('./pcc_pediatric_surg_ext32_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.142.0', module: 'pcc_pediatric_surg_ext32', label: 'PCC Pediatric Surg Ext32', functions: ['PediatricUrologyExt3', 'PediatricPyeloplastyExt', 'PediatricUreteralReimplantExt', 'PediatricHypospadiasRepairExt', 'PediatricEpispadiasRepairExt', 'PediatricBladderExstrophyExt', 'PediatricCloacalExstrophyExt', 'PediatricPosteriorUrethralValvesExt', 'PediatricNephrectomyExt', 'PediatricPartialNephrectomyExt'] });
});
router.post('/call/PediatricUrologyExt3', authenticate, (req, res) => {
  res.json(PediatricUrologyExt3(req.body));
});

router.post('/call/PediatricPyeloplastyExt', authenticate, (req, res) => {
  res.json(PediatricPyeloplastyExt(req.body));
});

router.post('/call/PediatricUreteralReimplantExt', authenticate, (req, res) => {
  res.json(PediatricUreteralReimplantExt(req.body));
});

router.post('/call/PediatricHypospadiasRepairExt', authenticate, (req, res) => {
  res.json(PediatricHypospadiasRepairExt(req.body));
});

router.post('/call/PediatricEpispadiasRepairExt', authenticate, (req, res) => {
  res.json(PediatricEpispadiasRepairExt(req.body));
});

router.post('/call/PediatricBladderExstrophyExt', authenticate, (req, res) => {
  res.json(PediatricBladderExstrophyExt(req.body));
});

router.post('/call/PediatricCloacalExstrophyExt', authenticate, (req, res) => {
  res.json(PediatricCloacalExstrophyExt(req.body));
});

router.post('/call/PediatricPosteriorUrethralValvesExt', authenticate, (req, res) => {
  res.json(PediatricPosteriorUrethralValvesExt(req.body));
});

router.post('/call/PediatricNephrectomyExt', authenticate, (req, res) => {
  res.json(PediatricNephrectomyExt(req.body));
});

router.post('/call/PediatricPartialNephrectomyExt', authenticate, (req, res) => {
  res.json(PediatricPartialNephrectomyExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.142.0', module: 'pcc_pediatric_surg_ext32', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
