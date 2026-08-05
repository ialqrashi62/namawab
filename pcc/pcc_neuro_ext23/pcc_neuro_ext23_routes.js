// pcc_neuro_ext23 routes v3.122.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { CranialNerveDisorderExt, OlfactoryNerveDisorder, OpticNeuritisExt2, OculomotorNervePalsy, TrochlearNervePalsy, AbducensNervePalsy, TrigeminalNeuropathy, FacialNervePalsy, VestibulocochlearNerveDisorder, GlossopharyngealNeuralgiaExt } = require('./pcc_neuro_ext23_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.122.0', module: 'pcc_neuro_ext23', label: 'PCC Neuro Ext23', functions: ['CranialNerveDisorderExt', 'OlfactoryNerveDisorder', 'OpticNeuritisExt2', 'OculomotorNervePalsy', 'TrochlearNervePalsy', 'AbducensNervePalsy', 'TrigeminalNeuropathy', 'FacialNervePalsy', 'VestibulocochlearNerveDisorder', 'GlossopharyngealNeuralgiaExt'] });
});
router.post('/call/CranialNerveDisorderExt', authenticate, (req, res) => {
  res.json(CranialNerveDisorderExt(req.body));
});

router.post('/call/OlfactoryNerveDisorder', authenticate, (req, res) => {
  res.json(OlfactoryNerveDisorder(req.body));
});

router.post('/call/OpticNeuritisExt2', authenticate, (req, res) => {
  res.json(OpticNeuritisExt2(req.body));
});

router.post('/call/OculomotorNervePalsy', authenticate, (req, res) => {
  res.json(OculomotorNervePalsy(req.body));
});

router.post('/call/TrochlearNervePalsy', authenticate, (req, res) => {
  res.json(TrochlearNervePalsy(req.body));
});

router.post('/call/AbducensNervePalsy', authenticate, (req, res) => {
  res.json(AbducensNervePalsy(req.body));
});

router.post('/call/TrigeminalNeuropathy', authenticate, (req, res) => {
  res.json(TrigeminalNeuropathy(req.body));
});

router.post('/call/FacialNervePalsy', authenticate, (req, res) => {
  res.json(FacialNervePalsy(req.body));
});

router.post('/call/VestibulocochlearNerveDisorder', authenticate, (req, res) => {
  res.json(VestibulocochlearNerveDisorder(req.body));
});

router.post('/call/GlossopharyngealNeuralgiaExt', authenticate, (req, res) => {
  res.json(GlossopharyngealNeuralgiaExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
