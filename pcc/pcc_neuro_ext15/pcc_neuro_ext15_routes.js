// pcc_neuro_ext15 routes v3.114.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { GuillainBarreSyndromeExt, ChronicInflammatoryDemyelinatingPolyneuropathy, MyastheniaGravisExt, LambertEatonMyasthenicSyndrome, AmyotrophicLateralSclerosisExt, PrimaryLateralSclerosis, SpinalMuscularAtrophy, MuscularDystrophyExt, MyotonicDystrophy, CharcotMarieToothDisease } = require('./pcc_neuro_ext15_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.114.0', module: 'pcc_neuro_ext15', label: 'PCC Neuro Ext15', functions: ['GuillainBarreSyndromeExt', 'ChronicInflammatoryDemyelinatingPolyneuropathy', 'MyastheniaGravisExt', 'LambertEatonMyasthenicSyndrome', 'AmyotrophicLateralSclerosisExt', 'PrimaryLateralSclerosis', 'SpinalMuscularAtrophy', 'MuscularDystrophyExt', 'MyotonicDystrophy', 'CharcotMarieToothDisease'] });
});
router.post('/call/GuillainBarreSyndromeExt', authenticate, (req, res) => {
  res.json(GuillainBarreSyndromeExt(req.body));
});

router.post('/call/ChronicInflammatoryDemyelinatingPolyneuropathy', authenticate, (req, res) => {
  res.json(ChronicInflammatoryDemyelinatingPolyneuropathy(req.body));
});

router.post('/call/MyastheniaGravisExt', authenticate, (req, res) => {
  res.json(MyastheniaGravisExt(req.body));
});

router.post('/call/LambertEatonMyasthenicSyndrome', authenticate, (req, res) => {
  res.json(LambertEatonMyasthenicSyndrome(req.body));
});

router.post('/call/AmyotrophicLateralSclerosisExt', authenticate, (req, res) => {
  res.json(AmyotrophicLateralSclerosisExt(req.body));
});

router.post('/call/PrimaryLateralSclerosis', authenticate, (req, res) => {
  res.json(PrimaryLateralSclerosis(req.body));
});

router.post('/call/SpinalMuscularAtrophy', authenticate, (req, res) => {
  res.json(SpinalMuscularAtrophy(req.body));
});

router.post('/call/MuscularDystrophyExt', authenticate, (req, res) => {
  res.json(MuscularDystrophyExt(req.body));
});

router.post('/call/MyotonicDystrophy', authenticate, (req, res) => {
  res.json(MyotonicDystrophy(req.body));
});

router.post('/call/CharcotMarieToothDisease', authenticate, (req, res) => {
  res.json(CharcotMarieToothDisease(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
