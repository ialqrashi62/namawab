// pcc_pediatric_surg_ext39 routes v3.149.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricOrthopedicTraumaExt, PediatricSupracondylarFractureExt, PediatricLateralCondyleFractureExt, PediatricMedialEpicondyleExt, PediatricForearmFractureExt, PediatricFemurFractureExt, PediatricTibiaFractureExt, PediatricAnkleFractureExt, PediatricSpineFractureExt, PediatricPelvicFractureExt } = require('./pcc_pediatric_surg_ext39_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.149.0', module: 'pcc_pediatric_surg_ext39', label: 'PCC Pediatric Surg Ext39', functions: ['PediatricOrthopedicTraumaExt', 'PediatricSupracondylarFractureExt', 'PediatricLateralCondyleFractureExt', 'PediatricMedialEpicondyleExt', 'PediatricForearmFractureExt', 'PediatricFemurFractureExt', 'PediatricTibiaFractureExt', 'PediatricAnkleFractureExt', 'PediatricSpineFractureExt', 'PediatricPelvicFractureExt'] });
});
router.post('/call/PediatricOrthopedicTraumaExt', authenticate, (req, res) => {
  res.json(PediatricOrthopedicTraumaExt(req.body));
});

router.post('/call/PediatricSupracondylarFractureExt', authenticate, (req, res) => {
  res.json(PediatricSupracondylarFractureExt(req.body));
});

router.post('/call/PediatricLateralCondyleFractureExt', authenticate, (req, res) => {
  res.json(PediatricLateralCondyleFractureExt(req.body));
});

router.post('/call/PediatricMedialEpicondyleExt', authenticate, (req, res) => {
  res.json(PediatricMedialEpicondyleExt(req.body));
});

router.post('/call/PediatricForearmFractureExt', authenticate, (req, res) => {
  res.json(PediatricForearmFractureExt(req.body));
});

router.post('/call/PediatricFemurFractureExt', authenticate, (req, res) => {
  res.json(PediatricFemurFractureExt(req.body));
});

router.post('/call/PediatricTibiaFractureExt', authenticate, (req, res) => {
  res.json(PediatricTibiaFractureExt(req.body));
});

router.post('/call/PediatricAnkleFractureExt', authenticate, (req, res) => {
  res.json(PediatricAnkleFractureExt(req.body));
});

router.post('/call/PediatricSpineFractureExt', authenticate, (req, res) => {
  res.json(PediatricSpineFractureExt(req.body));
});

router.post('/call/PediatricPelvicFractureExt', authenticate, (req, res) => {
  res.json(PediatricPelvicFractureExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
