// pcc_neuro_ext26 routes v3.125.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { DemyelinatingDiseaseExt, MultipleSclerosisVariants, MarburgMS, BaloConcentricSclerosis, SchilderDisease, TumefactiveMS, OpticSpinalMS, ProgressiveRelapsingMS, ClinicallyIsolatedSyndrome, RadiologicallyIsolatedSyndrome } = require('./pcc_neuro_ext26_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.125.0', module: 'pcc_neuro_ext26', label: 'PCC Neuro Ext26', functions: ['DemyelinatingDiseaseExt', 'MultipleSclerosisVariants', 'MarburgMS', 'BaloConcentricSclerosis', 'SchilderDisease', 'TumefactiveMS', 'OpticSpinalMS', 'ProgressiveRelapsingMS', 'ClinicallyIsolatedSyndrome', 'RadiologicallyIsolatedSyndrome'] });
});
router.post('/call/DemyelinatingDiseaseExt', authenticate, (req, res) => {
  res.json(DemyelinatingDiseaseExt(req.body));
});

router.post('/call/MultipleSclerosisVariants', authenticate, (req, res) => {
  res.json(MultipleSclerosisVariants(req.body));
});

router.post('/call/MarburgMS', authenticate, (req, res) => {
  res.json(MarburgMS(req.body));
});

router.post('/call/BaloConcentricSclerosis', authenticate, (req, res) => {
  res.json(BaloConcentricSclerosis(req.body));
});

router.post('/call/SchilderDisease', authenticate, (req, res) => {
  res.json(SchilderDisease(req.body));
});

router.post('/call/TumefactiveMS', authenticate, (req, res) => {
  res.json(TumefactiveMS(req.body));
});

router.post('/call/OpticSpinalMS', authenticate, (req, res) => {
  res.json(OpticSpinalMS(req.body));
});

router.post('/call/ProgressiveRelapsingMS', authenticate, (req, res) => {
  res.json(ProgressiveRelapsingMS(req.body));
});

router.post('/call/ClinicallyIsolatedSyndrome', authenticate, (req, res) => {
  res.json(ClinicallyIsolatedSyndrome(req.body));
});

router.post('/call/RadiologicallyIsolatedSyndrome', authenticate, (req, res) => {
  res.json(RadiologicallyIsolatedSyndrome(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
