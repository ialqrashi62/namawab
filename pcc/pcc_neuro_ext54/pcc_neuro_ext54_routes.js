// pcc_neuro_ext54 routes v3.153.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { NeuroacanthocytosisExt, ChoreaAcanthocytosisExt, McLeodSyndromeExt, HuntingtonDiseaseLike2Ext, HDL3Ext, HDL4Ext, SenileChoreaExt, BenignHereditaryChoreaExt, InheritedCreutzfeldtJakobExt, FatalFamilialInsomniaExt } = require('./pcc_neuro_ext54_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.153.0', module: 'pcc_neuro_ext54', label: 'PCC Neuro Ext54', functions: ['NeuroacanthocytosisExt', 'ChoreaAcanthocytosisExt', 'McLeodSyndromeExt', 'HuntingtonDiseaseLike2Ext', 'HDL3Ext', 'HDL4Ext', 'SenileChoreaExt', 'BenignHereditaryChoreaExt', 'InheritedCreutzfeldtJakobExt', 'FatalFamilialInsomniaExt'] });
});
router.post('/call/NeuroacanthocytosisExt', authenticate, (req, res) => {
  res.json(NeuroacanthocytosisExt(req.body));
});

router.post('/call/ChoreaAcanthocytosisExt', authenticate, (req, res) => {
  res.json(ChoreaAcanthocytosisExt(req.body));
});

router.post('/call/McLeodSyndromeExt', authenticate, (req, res) => {
  res.json(McLeodSyndromeExt(req.body));
});

router.post('/call/HuntingtonDiseaseLike2Ext', authenticate, (req, res) => {
  res.json(HuntingtonDiseaseLike2Ext(req.body));
});

router.post('/call/HDL3Ext', authenticate, (req, res) => {
  res.json(HDL3Ext(req.body));
});

router.post('/call/HDL4Ext', authenticate, (req, res) => {
  res.json(HDL4Ext(req.body));
});

router.post('/call/SenileChoreaExt', authenticate, (req, res) => {
  res.json(SenileChoreaExt(req.body));
});

router.post('/call/BenignHereditaryChoreaExt', authenticate, (req, res) => {
  res.json(BenignHereditaryChoreaExt(req.body));
});

router.post('/call/InheritedCreutzfeldtJakobExt', authenticate, (req, res) => {
  res.json(InheritedCreutzfeldtJakobExt(req.body));
});

router.post('/call/FatalFamilialInsomniaExt', authenticate, (req, res) => {
  res.json(FatalFamilialInsomniaExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
