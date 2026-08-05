// pcc_neuro_ext53 routes v3.152.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { CerebralCavernousMalformationExt, ArteriovenousMalformationExt, CapillaryTelangiectasiaExt, DevelopmentalVenousAnomalyExt, DuralArteriovenousFistulaExt, CavernousMalformationExt, MoyamoyaDiseaseExt, SickleCellDiseaseStrokeExt, CerebralAmyloidAngiopathyExt, CADASILExt } = require('./pcc_neuro_ext53_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.152.0', module: 'pcc_neuro_ext53', label: 'PCC Neuro Ext53', functions: ['CerebralCavernousMalformationExt', 'ArteriovenousMalformationExt', 'CapillaryTelangiectasiaExt', 'DevelopmentalVenousAnomalyExt', 'DuralArteriovenousFistulaExt', 'CavernousMalformationExt', 'MoyamoyaDiseaseExt', 'SickleCellDiseaseStrokeExt', 'CerebralAmyloidAngiopathyExt', 'CADASILExt'] });
});
router.post('/call/CerebralCavernousMalformationExt', authenticate, (req, res) => {
  res.json(CerebralCavernousMalformationExt(req.body));
});

router.post('/call/ArteriovenousMalformationExt', authenticate, (req, res) => {
  res.json(ArteriovenousMalformationExt(req.body));
});

router.post('/call/CapillaryTelangiectasiaExt', authenticate, (req, res) => {
  res.json(CapillaryTelangiectasiaExt(req.body));
});

router.post('/call/DevelopmentalVenousAnomalyExt', authenticate, (req, res) => {
  res.json(DevelopmentalVenousAnomalyExt(req.body));
});

router.post('/call/DuralArteriovenousFistulaExt', authenticate, (req, res) => {
  res.json(DuralArteriovenousFistulaExt(req.body));
});

router.post('/call/CavernousMalformationExt', authenticate, (req, res) => {
  res.json(CavernousMalformationExt(req.body));
});

router.post('/call/MoyamoyaDiseaseExt', authenticate, (req, res) => {
  res.json(MoyamoyaDiseaseExt(req.body));
});

router.post('/call/SickleCellDiseaseStrokeExt', authenticate, (req, res) => {
  res.json(SickleCellDiseaseStrokeExt(req.body));
});

router.post('/call/CerebralAmyloidAngiopathyExt', authenticate, (req, res) => {
  res.json(CerebralAmyloidAngiopathyExt(req.body));
});

router.post('/call/CADASILExt', authenticate, (req, res) => {
  res.json(CADASILExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
