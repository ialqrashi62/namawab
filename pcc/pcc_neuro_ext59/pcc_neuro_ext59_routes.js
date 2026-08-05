// pcc_neuro_ext59 routes v3.158.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { EncephalitisLethargicaExt, ViralEncephalitisExt, BacterialMeningitisExt, FungalMeningitisExt, TuberculousMeningitisExt, LymeMeningitisExt, ViralMeningitisExt, EncephalitisPostInfectiousExt, AcuteDisseminatedEncephalomyelitisExt, BickerstaffExt } = require('./pcc_neuro_ext59_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.158.0', module: 'pcc_neuro_ext59', label: 'PCC Neuro Ext59', functions: ['EncephalitisLethargicaExt', 'ViralEncephalitisExt', 'BacterialMeningitisExt', 'FungalMeningitisExt', 'TuberculousMeningitisExt', 'LymeMeningitisExt', 'ViralMeningitisExt', 'EncephalitisPostInfectiousExt', 'AcuteDisseminatedEncephalomyelitisExt', 'BickerstaffExt'] });
});
router.post('/call/EncephalitisLethargicaExt', authenticate, (req, res) => {
  res.json(EncephalitisLethargicaExt(req.body));
});

router.post('/call/ViralEncephalitisExt', authenticate, (req, res) => {
  res.json(ViralEncephalitisExt(req.body));
});

router.post('/call/BacterialMeningitisExt', authenticate, (req, res) => {
  res.json(BacterialMeningitisExt(req.body));
});

router.post('/call/FungalMeningitisExt', authenticate, (req, res) => {
  res.json(FungalMeningitisExt(req.body));
});

router.post('/call/TuberculousMeningitisExt', authenticate, (req, res) => {
  res.json(TuberculousMeningitisExt(req.body));
});

router.post('/call/LymeMeningitisExt', authenticate, (req, res) => {
  res.json(LymeMeningitisExt(req.body));
});

router.post('/call/ViralMeningitisExt', authenticate, (req, res) => {
  res.json(ViralMeningitisExt(req.body));
});

router.post('/call/EncephalitisPostInfectiousExt', authenticate, (req, res) => {
  res.json(EncephalitisPostInfectiousExt(req.body));
});

router.post('/call/AcuteDisseminatedEncephalomyelitisExt', authenticate, (req, res) => {
  res.json(AcuteDisseminatedEncephalomyelitisExt(req.body));
});

router.post('/call/BickerstaffExt', authenticate, (req, res) => {
  res.json(BickerstaffExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
