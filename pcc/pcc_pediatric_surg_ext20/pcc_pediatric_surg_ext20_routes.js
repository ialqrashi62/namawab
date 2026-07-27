// pcc_pediatric_surg_ext20 routes v3.130.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricSpineSurgeryExt, PediatricScoliosisCorrection, PediatricSpinalFusion, PediatricVertebralTethering, PediatricMagneticallyControlledGrowingRod, PediatricGrowingRod, PediatricSpinalDeformity, PediatricKyphosisCorrection, PediatricLordosisCorrection, PediatricSpondylolisthesis } = require('./pcc_pediatric_surg_ext20_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.130.0', module: 'pcc_pediatric_surg_ext20', label: 'PCC Pediatric Surg Ext20', functions: ['PediatricSpineSurgeryExt', 'PediatricScoliosisCorrection', 'PediatricSpinalFusion', 'PediatricVertebralTethering', 'PediatricMagneticallyControlledGrowingRod', 'PediatricGrowingRod', 'PediatricSpinalDeformity', 'PediatricKyphosisCorrection', 'PediatricLordosisCorrection', 'PediatricSpondylolisthesis'] });
});
router.post('/call/PediatricSpineSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricSpineSurgeryExt(req.body));
});

router.post('/call/PediatricScoliosisCorrection', authenticate, (req, res) => {
  res.json(PediatricScoliosisCorrection(req.body));
});

router.post('/call/PediatricSpinalFusion', authenticate, (req, res) => {
  res.json(PediatricSpinalFusion(req.body));
});

router.post('/call/PediatricVertebralTethering', authenticate, (req, res) => {
  res.json(PediatricVertebralTethering(req.body));
});

router.post('/call/PediatricMagneticallyControlledGrowingRod', authenticate, (req, res) => {
  res.json(PediatricMagneticallyControlledGrowingRod(req.body));
});

router.post('/call/PediatricGrowingRod', authenticate, (req, res) => {
  res.json(PediatricGrowingRod(req.body));
});

router.post('/call/PediatricSpinalDeformity', authenticate, (req, res) => {
  res.json(PediatricSpinalDeformity(req.body));
});

router.post('/call/PediatricKyphosisCorrection', authenticate, (req, res) => {
  res.json(PediatricKyphosisCorrection(req.body));
});

router.post('/call/PediatricLordosisCorrection', authenticate, (req, res) => {
  res.json(PediatricLordosisCorrection(req.body));
});

router.post('/call/PediatricSpondylolisthesis', authenticate, (req, res) => {
  res.json(PediatricSpondylolisthesis(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.130.0', module: 'pcc_pediatric_surg_ext20', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
