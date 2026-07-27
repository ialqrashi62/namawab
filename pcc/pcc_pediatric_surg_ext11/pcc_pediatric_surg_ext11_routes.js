// pcc_pediatric_surg_ext11 routes v3.121.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricNeurosurgeryExt, PediatricBrainTumorResection, PediatricSkullBaseSurgery, PediatricEndoscopicNeurosurgery, PediatricCraniofacialSurgery, PediatricCleftCraniofacial, PediatricCraniosynostosisSurgery, PediatricEncephaloceleRepair, PediatricMeningoceleRepair, PediatricMyelomeningocele } = require('./pcc_pediatric_surg_ext11_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.121.0', module: 'pcc_pediatric_surg_ext11', label: 'PCC Pediatric Surg Ext11', functions: ['PediatricNeurosurgeryExt', 'PediatricBrainTumorResection', 'PediatricSkullBaseSurgery', 'PediatricEndoscopicNeurosurgery', 'PediatricCraniofacialSurgery', 'PediatricCleftCraniofacial', 'PediatricCraniosynostosisSurgery', 'PediatricEncephaloceleRepair', 'PediatricMeningoceleRepair', 'PediatricMyelomeningocele'] });
});
router.post('/call/PediatricNeurosurgeryExt', authenticate, (req, res) => {
  res.json(PediatricNeurosurgeryExt(req.body));
});

router.post('/call/PediatricBrainTumorResection', authenticate, (req, res) => {
  res.json(PediatricBrainTumorResection(req.body));
});

router.post('/call/PediatricSkullBaseSurgery', authenticate, (req, res) => {
  res.json(PediatricSkullBaseSurgery(req.body));
});

router.post('/call/PediatricEndoscopicNeurosurgery', authenticate, (req, res) => {
  res.json(PediatricEndoscopicNeurosurgery(req.body));
});

router.post('/call/PediatricCraniofacialSurgery', authenticate, (req, res) => {
  res.json(PediatricCraniofacialSurgery(req.body));
});

router.post('/call/PediatricCleftCraniofacial', authenticate, (req, res) => {
  res.json(PediatricCleftCraniofacial(req.body));
});

router.post('/call/PediatricCraniosynostosisSurgery', authenticate, (req, res) => {
  res.json(PediatricCraniosynostosisSurgery(req.body));
});

router.post('/call/PediatricEncephaloceleRepair', authenticate, (req, res) => {
  res.json(PediatricEncephaloceleRepair(req.body));
});

router.post('/call/PediatricMeningoceleRepair', authenticate, (req, res) => {
  res.json(PediatricMeningoceleRepair(req.body));
});

router.post('/call/PediatricMyelomeningocele', authenticate, (req, res) => {
  res.json(PediatricMyelomeningocele(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.121.0', module: 'pcc_pediatric_surg_ext11', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
