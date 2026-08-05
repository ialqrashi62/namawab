// pcc_neuro_ext58 routes v3.157.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { CentralNervousSystemLupusExt, NeuroBehcetExt, NeuroSarcoidosisExt, NeurosyphilisExt, NeuroLymeDiseaseExt, NeuroBrucellosisExt, NeuroWhippleDiseaseExt, NeuroCysticercosisExt, NeuroToxoplasmosisExt, NeuroCysticercosisSurgeryExt } = require('./pcc_neuro_ext58_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.157.0', module: 'pcc_neuro_ext58', label: 'PCC Neuro Ext58', functions: ['CentralNervousSystemLupusExt', 'NeuroBehcetExt', 'NeuroSarcoidosisExt', 'NeurosyphilisExt', 'NeuroLymeDiseaseExt', 'NeuroBrucellosisExt', 'NeuroWhippleDiseaseExt', 'NeuroCysticercosisExt', 'NeuroToxoplasmosisExt', 'NeuroCysticercosisSurgeryExt'] });
});
router.post('/call/CentralNervousSystemLupusExt', authenticate, (req, res) => {
  res.json(CentralNervousSystemLupusExt(req.body));
});

router.post('/call/NeuroBehcetExt', authenticate, (req, res) => {
  res.json(NeuroBehcetExt(req.body));
});

router.post('/call/NeuroSarcoidosisExt', authenticate, (req, res) => {
  res.json(NeuroSarcoidosisExt(req.body));
});

router.post('/call/NeurosyphilisExt', authenticate, (req, res) => {
  res.json(NeurosyphilisExt(req.body));
});

router.post('/call/NeuroLymeDiseaseExt', authenticate, (req, res) => {
  res.json(NeuroLymeDiseaseExt(req.body));
});

router.post('/call/NeuroBrucellosisExt', authenticate, (req, res) => {
  res.json(NeuroBrucellosisExt(req.body));
});

router.post('/call/NeuroWhippleDiseaseExt', authenticate, (req, res) => {
  res.json(NeuroWhippleDiseaseExt(req.body));
});

router.post('/call/NeuroCysticercosisExt', authenticate, (req, res) => {
  res.json(NeuroCysticercosisExt(req.body));
});

router.post('/call/NeuroToxoplasmosisExt', authenticate, (req, res) => {
  res.json(NeuroToxoplasmosisExt(req.body));
});

router.post('/call/NeuroCysticercosisSurgeryExt', authenticate, (req, res) => {
  res.json(NeuroCysticercosisSurgeryExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
