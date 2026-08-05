// pcc_pediatric_surg_ext47 routes v3.157.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricENTCancerExt, PediatricLaryngealCancerExt, PediatricThyroidCancerExt, PediatricNasopharyngealExt, PediatricSalivaryGlandTumorExt, PediatricLymphomaNeckExt, PediatricRhabdomyosarcomaNeckExt, PediatricNeuroblastomaNeckExt, PediatricFibromatosisColliExt, PediatricBranchogenicCarcinomaExt } = require('./pcc_pediatric_surg_ext47_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.157.0', module: 'pcc_pediatric_surg_ext47', label: 'PCC Pediatric Surg Ext47', functions: ['PediatricENTCancerExt', 'PediatricLaryngealCancerExt', 'PediatricThyroidCancerExt', 'PediatricNasopharyngealExt', 'PediatricSalivaryGlandTumorExt', 'PediatricLymphomaNeckExt', 'PediatricRhabdomyosarcomaNeckExt', 'PediatricNeuroblastomaNeckExt', 'PediatricFibromatosisColliExt', 'PediatricBranchogenicCarcinomaExt'] });
});
router.post('/call/PediatricENTCancerExt', authenticate, (req, res) => {
  res.json(PediatricENTCancerExt(req.body));
});

router.post('/call/PediatricLaryngealCancerExt', authenticate, (req, res) => {
  res.json(PediatricLaryngealCancerExt(req.body));
});

router.post('/call/PediatricThyroidCancerExt', authenticate, (req, res) => {
  res.json(PediatricThyroidCancerExt(req.body));
});

router.post('/call/PediatricNasopharyngealExt', authenticate, (req, res) => {
  res.json(PediatricNasopharyngealExt(req.body));
});

router.post('/call/PediatricSalivaryGlandTumorExt', authenticate, (req, res) => {
  res.json(PediatricSalivaryGlandTumorExt(req.body));
});

router.post('/call/PediatricLymphomaNeckExt', authenticate, (req, res) => {
  res.json(PediatricLymphomaNeckExt(req.body));
});

router.post('/call/PediatricRhabdomyosarcomaNeckExt', authenticate, (req, res) => {
  res.json(PediatricRhabdomyosarcomaNeckExt(req.body));
});

router.post('/call/PediatricNeuroblastomaNeckExt', authenticate, (req, res) => {
  res.json(PediatricNeuroblastomaNeckExt(req.body));
});

router.post('/call/PediatricFibromatosisColliExt', authenticate, (req, res) => {
  res.json(PediatricFibromatosisColliExt(req.body));
});

router.post('/call/PediatricBranchogenicCarcinomaExt', authenticate, (req, res) => {
  res.json(PediatricBranchogenicCarcinomaExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
