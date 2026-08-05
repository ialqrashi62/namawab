// pcc_pediatric_neuro_ext28 routes v3.138.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricMeningitisExt3, PediatricEncephalitisExt, PediatricBrainAbscessExt, PediatricSubduralEmpyema, PediatricEpiduralAbscessExt, PediatricCerebritisExt, PediatricADEMExt, PediatricAcuteFlaccidMyelitisExt, PediatricAntiNMDAReceptorExt, PediatricAutoimmuneEncephalitis } = require('./pcc_pediatric_neuro_ext28_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.138.0', module: 'pcc_pediatric_neuro_ext28', label: 'PCC Pediatric Neuro Ext28', functions: ['PediatricMeningitisExt3', 'PediatricEncephalitisExt', 'PediatricBrainAbscessExt', 'PediatricSubduralEmpyema', 'PediatricEpiduralAbscessExt', 'PediatricCerebritisExt', 'PediatricADEMExt', 'PediatricAcuteFlaccidMyelitisExt', 'PediatricAntiNMDAReceptorExt', 'PediatricAutoimmuneEncephalitis'] });
});
router.post('/call/PediatricMeningitisExt3', authenticate, (req, res) => {
  res.json(PediatricMeningitisExt3(req.body));
});

router.post('/call/PediatricEncephalitisExt', authenticate, (req, res) => {
  res.json(PediatricEncephalitisExt(req.body));
});

router.post('/call/PediatricBrainAbscessExt', authenticate, (req, res) => {
  res.json(PediatricBrainAbscessExt(req.body));
});

router.post('/call/PediatricSubduralEmpyema', authenticate, (req, res) => {
  res.json(PediatricSubduralEmpyema(req.body));
});

router.post('/call/PediatricEpiduralAbscessExt', authenticate, (req, res) => {
  res.json(PediatricEpiduralAbscessExt(req.body));
});

router.post('/call/PediatricCerebritisExt', authenticate, (req, res) => {
  res.json(PediatricCerebritisExt(req.body));
});

router.post('/call/PediatricADEMExt', authenticate, (req, res) => {
  res.json(PediatricADEMExt(req.body));
});

router.post('/call/PediatricAcuteFlaccidMyelitisExt', authenticate, (req, res) => {
  res.json(PediatricAcuteFlaccidMyelitisExt(req.body));
});

router.post('/call/PediatricAntiNMDAReceptorExt', authenticate, (req, res) => {
  res.json(PediatricAntiNMDAReceptorExt(req.body));
});

router.post('/call/PediatricAutoimmuneEncephalitis', authenticate, (req, res) => {
  res.json(PediatricAutoimmuneEncephalitis(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
