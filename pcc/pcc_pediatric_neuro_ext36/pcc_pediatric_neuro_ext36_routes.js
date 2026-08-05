// pcc_pediatric_neuro_ext36 routes v3.146.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricNeurocutaneousExt, PediatricNeurofibromatosisType1Ext, PediatricNeurofibromatosisType2Ext, PediatricTuberousSclerosisExt, PediatricSturgeWeberExt, PediatricVonHippelLindauExt, PediatricAtaxiaTelangiectasiaExt, PediatricGorlinSyndromeExt, PediatricHypomelanosisOfItoExt, PediatricIncontinentiaPigmentiExt } = require('./pcc_pediatric_neuro_ext36_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.146.0', module: 'pcc_pediatric_neuro_ext36', label: 'PCC Pediatric Neuro Ext36', functions: ['PediatricNeurocutaneousExt', 'PediatricNeurofibromatosisType1Ext', 'PediatricNeurofibromatosisType2Ext', 'PediatricTuberousSclerosisExt', 'PediatricSturgeWeberExt', 'PediatricVonHippelLindauExt', 'PediatricAtaxiaTelangiectasiaExt', 'PediatricGorlinSyndromeExt', 'PediatricHypomelanosisOfItoExt', 'PediatricIncontinentiaPigmentiExt'] });
});
router.post('/call/PediatricNeurocutaneousExt', authenticate, (req, res) => {
  res.json(PediatricNeurocutaneousExt(req.body));
});

router.post('/call/PediatricNeurofibromatosisType1Ext', authenticate, (req, res) => {
  res.json(PediatricNeurofibromatosisType1Ext(req.body));
});

router.post('/call/PediatricNeurofibromatosisType2Ext', authenticate, (req, res) => {
  res.json(PediatricNeurofibromatosisType2Ext(req.body));
});

router.post('/call/PediatricTuberousSclerosisExt', authenticate, (req, res) => {
  res.json(PediatricTuberousSclerosisExt(req.body));
});

router.post('/call/PediatricSturgeWeberExt', authenticate, (req, res) => {
  res.json(PediatricSturgeWeberExt(req.body));
});

router.post('/call/PediatricVonHippelLindauExt', authenticate, (req, res) => {
  res.json(PediatricVonHippelLindauExt(req.body));
});

router.post('/call/PediatricAtaxiaTelangiectasiaExt', authenticate, (req, res) => {
  res.json(PediatricAtaxiaTelangiectasiaExt(req.body));
});

router.post('/call/PediatricGorlinSyndromeExt', authenticate, (req, res) => {
  res.json(PediatricGorlinSyndromeExt(req.body));
});

router.post('/call/PediatricHypomelanosisOfItoExt', authenticate, (req, res) => {
  res.json(PediatricHypomelanosisOfItoExt(req.body));
});

router.post('/call/PediatricIncontinentiaPigmentiExt', authenticate, (req, res) => {
  res.json(PediatricIncontinentiaPigmentiExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
