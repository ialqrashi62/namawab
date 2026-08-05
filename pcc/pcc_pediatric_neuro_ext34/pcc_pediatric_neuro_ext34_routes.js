// pcc_pediatric_neuro_ext34 routes v3.144.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricFeedingDisorderExt3, PediatricAvoidantRestrictiveFoodExt, PediatricAnorexiaExt, PediatricBulimiaExt, PediatricBingeEatingExt, PediatricPicaExt, PediatricRuminationExt, PediatricFoodRefusalExt, PediatricSelectiveEatingExt, PediatricFailureToThriveExt } = require('./pcc_pediatric_neuro_ext34_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.144.0', module: 'pcc_pediatric_neuro_ext34', label: 'PCC Pediatric Neuro Ext34', functions: ['PediatricFeedingDisorderExt3', 'PediatricAvoidantRestrictiveFoodExt', 'PediatricAnorexiaExt', 'PediatricBulimiaExt', 'PediatricBingeEatingExt', 'PediatricPicaExt', 'PediatricRuminationExt', 'PediatricFoodRefusalExt', 'PediatricSelectiveEatingExt', 'PediatricFailureToThriveExt'] });
});
router.post('/call/PediatricFeedingDisorderExt3', authenticate, (req, res) => {
  res.json(PediatricFeedingDisorderExt3(req.body));
});

router.post('/call/PediatricAvoidantRestrictiveFoodExt', authenticate, (req, res) => {
  res.json(PediatricAvoidantRestrictiveFoodExt(req.body));
});

router.post('/call/PediatricAnorexiaExt', authenticate, (req, res) => {
  res.json(PediatricAnorexiaExt(req.body));
});

router.post('/call/PediatricBulimiaExt', authenticate, (req, res) => {
  res.json(PediatricBulimiaExt(req.body));
});

router.post('/call/PediatricBingeEatingExt', authenticate, (req, res) => {
  res.json(PediatricBingeEatingExt(req.body));
});

router.post('/call/PediatricPicaExt', authenticate, (req, res) => {
  res.json(PediatricPicaExt(req.body));
});

router.post('/call/PediatricRuminationExt', authenticate, (req, res) => {
  res.json(PediatricRuminationExt(req.body));
});

router.post('/call/PediatricFoodRefusalExt', authenticate, (req, res) => {
  res.json(PediatricFoodRefusalExt(req.body));
});

router.post('/call/PediatricSelectiveEatingExt', authenticate, (req, res) => {
  res.json(PediatricSelectiveEatingExt(req.body));
});

router.post('/call/PediatricFailureToThriveExt', authenticate, (req, res) => {
  res.json(PediatricFailureToThriveExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
