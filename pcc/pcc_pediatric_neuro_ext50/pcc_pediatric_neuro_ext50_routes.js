// pcc_pediatric_neuro_ext50 routes v3.160.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricAcuteDisseminatedEncephalomyelitisExt, PediatricMultipleSclerosisExt, PediatricNMOSDExt, PediatricMOGAntibodyDiseaseExt, PediatricClinicallyIsolatedSyndromeExt, PediatricRadiologicallyIsolatedSyndromeExt, PediatricBilateralOpticNeuritisExt, PediatricTransverseMyelitisExt, PediatricAcuteFlaccidMyelitisExt, PediatricAutoimmuneEncephalitisExt2 } = require('./pcc_pediatric_neuro_ext50_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.160.0', module: 'pcc_pediatric_neuro_ext50', label: 'PCC Pediatric Neuro Ext50', functions: ['PediatricAcuteDisseminatedEncephalomyelitisExt', 'PediatricMultipleSclerosisExt', 'PediatricNMOSDExt', 'PediatricMOGAntibodyDiseaseExt', 'PediatricClinicallyIsolatedSyndromeExt', 'PediatricRadiologicallyIsolatedSyndromeExt', 'PediatricBilateralOpticNeuritisExt', 'PediatricTransverseMyelitisExt', 'PediatricAcuteFlaccidMyelitisExt', 'PediatricAutoimmuneEncephalitisExt2'] });
});
router.post('/call/PediatricAcuteDisseminatedEncephalomyelitisExt', authenticate, (req, res) => {
  res.json(PediatricAcuteDisseminatedEncephalomyelitisExt(req.body));
});

router.post('/call/PediatricMultipleSclerosisExt', authenticate, (req, res) => {
  res.json(PediatricMultipleSclerosisExt(req.body));
});

router.post('/call/PediatricNMOSDExt', authenticate, (req, res) => {
  res.json(PediatricNMOSDExt(req.body));
});

router.post('/call/PediatricMOGAntibodyDiseaseExt', authenticate, (req, res) => {
  res.json(PediatricMOGAntibodyDiseaseExt(req.body));
});

router.post('/call/PediatricClinicallyIsolatedSyndromeExt', authenticate, (req, res) => {
  res.json(PediatricClinicallyIsolatedSyndromeExt(req.body));
});

router.post('/call/PediatricRadiologicallyIsolatedSyndromeExt', authenticate, (req, res) => {
  res.json(PediatricRadiologicallyIsolatedSyndromeExt(req.body));
});

router.post('/call/PediatricBilateralOpticNeuritisExt', authenticate, (req, res) => {
  res.json(PediatricBilateralOpticNeuritisExt(req.body));
});

router.post('/call/PediatricTransverseMyelitisExt', authenticate, (req, res) => {
  res.json(PediatricTransverseMyelitisExt(req.body));
});

router.post('/call/PediatricAcuteFlaccidMyelitisExt', authenticate, (req, res) => {
  res.json(PediatricAcuteFlaccidMyelitisExt(req.body));
});

router.post('/call/PediatricAutoimmuneEncephalitisExt2', authenticate, (req, res) => {
  res.json(PediatricAutoimmuneEncephalitisExt2(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
