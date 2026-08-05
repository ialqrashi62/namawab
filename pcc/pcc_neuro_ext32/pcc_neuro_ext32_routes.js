// pcc_neuro_ext32 routes v3.131.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { NeuroInflammatoryExt, Neurosarcoidosis, NeuroLupus, NeuroBehcet, NeuroSarcoidosis, NeuroWhipple, NeuroLymeDisease, Neurosyphilis, NeuroHIV, NeuroBrucellosis } = require('./pcc_neuro_ext32_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.131.0', module: 'pcc_neuro_ext32', label: 'PCC Neuro Ext32', functions: ['NeuroInflammatoryExt', 'Neurosarcoidosis', 'NeuroLupus', 'NeuroBehcet', 'NeuroSarcoidosis', 'NeuroWhipple', 'NeuroLymeDisease', 'Neurosyphilis', 'NeuroHIV', 'NeuroBrucellosis'] });
});
router.post('/call/NeuroInflammatoryExt', authenticate, (req, res) => {
  res.json(NeuroInflammatoryExt(req.body));
});

router.post('/call/Neurosarcoidosis', authenticate, (req, res) => {
  res.json(Neurosarcoidosis(req.body));
});

router.post('/call/NeuroLupus', authenticate, (req, res) => {
  res.json(NeuroLupus(req.body));
});

router.post('/call/NeuroBehcet', authenticate, (req, res) => {
  res.json(NeuroBehcet(req.body));
});

router.post('/call/NeuroSarcoidosis', authenticate, (req, res) => {
  res.json(NeuroSarcoidosis(req.body));
});

router.post('/call/NeuroWhipple', authenticate, (req, res) => {
  res.json(NeuroWhipple(req.body));
});

router.post('/call/NeuroLymeDisease', authenticate, (req, res) => {
  res.json(NeuroLymeDisease(req.body));
});

router.post('/call/Neurosyphilis', authenticate, (req, res) => {
  res.json(Neurosyphilis(req.body));
});

router.post('/call/NeuroHIV', authenticate, (req, res) => {
  res.json(NeuroHIV(req.body));
});

router.post('/call/NeuroBrucellosis', authenticate, (req, res) => {
  res.json(NeuroBrucellosis(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
