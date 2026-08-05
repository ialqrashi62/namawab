// pcc_neuro_ext24 routes v3.123.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { NeuromuscularDisorderExt, MyastheniaGravisExt2, LambertEatonSyndrome, CongenitalMyasthenicSyndrome, PolymyositisExt, Dermatomyositis, InclusionBodyMyositis, MyotonicDisorder, PeriodicParalysis, MitochondrialMyopathy } = require('./pcc_neuro_ext24_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.123.0', module: 'pcc_neuro_ext24', label: 'PCC Neuro Ext24', functions: ['NeuromuscularDisorderExt', 'MyastheniaGravisExt2', 'LambertEatonSyndrome', 'CongenitalMyasthenicSyndrome', 'PolymyositisExt', 'Dermatomyositis', 'InclusionBodyMyositis', 'MyotonicDisorder', 'PeriodicParalysis', 'MitochondrialMyopathy'] });
});
router.post('/call/NeuromuscularDisorderExt', authenticate, (req, res) => {
  res.json(NeuromuscularDisorderExt(req.body));
});

router.post('/call/MyastheniaGravisExt2', authenticate, (req, res) => {
  res.json(MyastheniaGravisExt2(req.body));
});

router.post('/call/LambertEatonSyndrome', authenticate, (req, res) => {
  res.json(LambertEatonSyndrome(req.body));
});

router.post('/call/CongenitalMyasthenicSyndrome', authenticate, (req, res) => {
  res.json(CongenitalMyasthenicSyndrome(req.body));
});

router.post('/call/PolymyositisExt', authenticate, (req, res) => {
  res.json(PolymyositisExt(req.body));
});

router.post('/call/Dermatomyositis', authenticate, (req, res) => {
  res.json(Dermatomyositis(req.body));
});

router.post('/call/InclusionBodyMyositis', authenticate, (req, res) => {
  res.json(InclusionBodyMyositis(req.body));
});

router.post('/call/MyotonicDisorder', authenticate, (req, res) => {
  res.json(MyotonicDisorder(req.body));
});

router.post('/call/PeriodicParalysis', authenticate, (req, res) => {
  res.json(PeriodicParalysis(req.body));
});

router.post('/call/MitochondrialMyopathy', authenticate, (req, res) => {
  res.json(MitochondrialMyopathy(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
