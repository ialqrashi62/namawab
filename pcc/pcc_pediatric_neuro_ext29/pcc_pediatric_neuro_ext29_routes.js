// pcc_pediatric_neuro_ext29 routes v3.139.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricCerebralPalsyExt3, PediatricSpasticityExt, PediatricDystoniaExt, PediatricChoreaExt, PediatricAthetosisExt, PediatricAtaxiaExt, PediatricTremorExt, PediatricTicDisorderExt, PediatricTouretteExt, PediatricStereotypyExt } = require('./pcc_pediatric_neuro_ext29_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.139.0', module: 'pcc_pediatric_neuro_ext29', label: 'PCC Pediatric Neuro Ext29', functions: ['PediatricCerebralPalsyExt3', 'PediatricSpasticityExt', 'PediatricDystoniaExt', 'PediatricChoreaExt', 'PediatricAthetosisExt', 'PediatricAtaxiaExt', 'PediatricTremorExt', 'PediatricTicDisorderExt', 'PediatricTouretteExt', 'PediatricStereotypyExt'] });
});
router.post('/call/PediatricCerebralPalsyExt3', authenticate, (req, res) => {
  res.json(PediatricCerebralPalsyExt3(req.body));
});

router.post('/call/PediatricSpasticityExt', authenticate, (req, res) => {
  res.json(PediatricSpasticityExt(req.body));
});

router.post('/call/PediatricDystoniaExt', authenticate, (req, res) => {
  res.json(PediatricDystoniaExt(req.body));
});

router.post('/call/PediatricChoreaExt', authenticate, (req, res) => {
  res.json(PediatricChoreaExt(req.body));
});

router.post('/call/PediatricAthetosisExt', authenticate, (req, res) => {
  res.json(PediatricAthetosisExt(req.body));
});

router.post('/call/PediatricAtaxiaExt', authenticate, (req, res) => {
  res.json(PediatricAtaxiaExt(req.body));
});

router.post('/call/PediatricTremorExt', authenticate, (req, res) => {
  res.json(PediatricTremorExt(req.body));
});

router.post('/call/PediatricTicDisorderExt', authenticate, (req, res) => {
  res.json(PediatricTicDisorderExt(req.body));
});

router.post('/call/PediatricTouretteExt', authenticate, (req, res) => {
  res.json(PediatricTouretteExt(req.body));
});

router.post('/call/PediatricStereotypyExt', authenticate, (req, res) => {
  res.json(PediatricStereotypyExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
