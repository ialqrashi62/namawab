// pcc_pediatric_neuro_ext40 routes v3.150.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricMovementDisorderExt3, PediatricSydenhamChoreaExt, PediatricPANDASExt, PediatricPANSext, PediatricAutoimmuneEncephalitisExt2, PediatricOpsoclonusMyoclonusExt, PediatricParaneoplasticSyndromeExt, PediatricAntiGADExt, PediatricAntiLGI1Ext, PediatricAntiCASPR2Ext } = require('./pcc_pediatric_neuro_ext40_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.150.0', module: 'pcc_pediatric_neuro_ext40', label: 'PCC Pediatric Neuro Ext40', functions: ['PediatricMovementDisorderExt3', 'PediatricSydenhamChoreaExt', 'PediatricPANDASExt', 'PediatricPANSext', 'PediatricAutoimmuneEncephalitisExt2', 'PediatricOpsoclonusMyoclonusExt', 'PediatricParaneoplasticSyndromeExt', 'PediatricAntiGADExt', 'PediatricAntiLGI1Ext', 'PediatricAntiCASPR2Ext'] });
});
router.post('/call/PediatricMovementDisorderExt3', authenticate, (req, res) => {
  res.json(PediatricMovementDisorderExt3(req.body));
});

router.post('/call/PediatricSydenhamChoreaExt', authenticate, (req, res) => {
  res.json(PediatricSydenhamChoreaExt(req.body));
});

router.post('/call/PediatricPANDASExt', authenticate, (req, res) => {
  res.json(PediatricPANDASExt(req.body));
});

router.post('/call/PediatricPANSext', authenticate, (req, res) => {
  res.json(PediatricPANSext(req.body));
});

router.post('/call/PediatricAutoimmuneEncephalitisExt2', authenticate, (req, res) => {
  res.json(PediatricAutoimmuneEncephalitisExt2(req.body));
});

router.post('/call/PediatricOpsoclonusMyoclonusExt', authenticate, (req, res) => {
  res.json(PediatricOpsoclonusMyoclonusExt(req.body));
});

router.post('/call/PediatricParaneoplasticSyndromeExt', authenticate, (req, res) => {
  res.json(PediatricParaneoplasticSyndromeExt(req.body));
});

router.post('/call/PediatricAntiGADExt', authenticate, (req, res) => {
  res.json(PediatricAntiGADExt(req.body));
});

router.post('/call/PediatricAntiLGI1Ext', authenticate, (req, res) => {
  res.json(PediatricAntiLGI1Ext(req.body));
});

router.post('/call/PediatricAntiCASPR2Ext', authenticate, (req, res) => {
  res.json(PediatricAntiCASPR2Ext(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.150.0', module: 'pcc_pediatric_neuro_ext40', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
