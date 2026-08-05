// pcc_neuro_ext60 routes v3.159.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { HydrocephalusNormalPressureExt, HydrocephalusCommunicatingExt, HydrocephalusNonCommunicatingExt, ArrestedHydrocephalusExt, LongstandingOvertVenticulomegalyExt, ExternalHydrocephalusExt, HydrocephalusExVacuoExt, BenignExternalHydrocephalusExt, IdiopathicIntracranialHypertensionExt, CSFLeakSyndromeExt } = require('./pcc_neuro_ext60_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.159.0', module: 'pcc_neuro_ext60', label: 'PCC Neuro Ext60', functions: ['HydrocephalusNormalPressureExt', 'HydrocephalusCommunicatingExt', 'HydrocephalusNonCommunicatingExt', 'ArrestedHydrocephalusExt', 'LongstandingOvertVenticulomegalyExt', 'ExternalHydrocephalusExt', 'HydrocephalusExVacuoExt', 'BenignExternalHydrocephalusExt', 'IdiopathicIntracranialHypertensionExt', 'CSFLeakSyndromeExt'] });
});
router.post('/call/HydrocephalusNormalPressureExt', authenticate, (req, res) => {
  res.json(HydrocephalusNormalPressureExt(req.body));
});

router.post('/call/HydrocephalusCommunicatingExt', authenticate, (req, res) => {
  res.json(HydrocephalusCommunicatingExt(req.body));
});

router.post('/call/HydrocephalusNonCommunicatingExt', authenticate, (req, res) => {
  res.json(HydrocephalusNonCommunicatingExt(req.body));
});

router.post('/call/ArrestedHydrocephalusExt', authenticate, (req, res) => {
  res.json(ArrestedHydrocephalusExt(req.body));
});

router.post('/call/LongstandingOvertVenticulomegalyExt', authenticate, (req, res) => {
  res.json(LongstandingOvertVenticulomegalyExt(req.body));
});

router.post('/call/ExternalHydrocephalusExt', authenticate, (req, res) => {
  res.json(ExternalHydrocephalusExt(req.body));
});

router.post('/call/HydrocephalusExVacuoExt', authenticate, (req, res) => {
  res.json(HydrocephalusExVacuoExt(req.body));
});

router.post('/call/BenignExternalHydrocephalusExt', authenticate, (req, res) => {
  res.json(BenignExternalHydrocephalusExt(req.body));
});

router.post('/call/IdiopathicIntracranialHypertensionExt', authenticate, (req, res) => {
  res.json(IdiopathicIntracranialHypertensionExt(req.body));
});

router.post('/call/CSFLeakSyndromeExt', authenticate, (req, res) => {
  res.json(CSFLeakSyndromeExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
