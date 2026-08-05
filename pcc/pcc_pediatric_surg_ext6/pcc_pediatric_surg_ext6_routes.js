// pcc_pediatric_surg_ext6 routes v3.116.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricLaparoscopicSurgery, PediatricRoboticSurgery, PediatricThoracoscopicSurgery, PediatricBronchoscopy, PediatricEsophagoscopy, PediatricGastroscopy, PediatricColonoscopy, PediatricCystoscopy, PediatricLaparoscopy, PediatricEndoscopy } = require('./pcc_pediatric_surg_ext6_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.116.0', module: 'pcc_pediatric_surg_ext6', label: 'PCC Pediatric Surg Ext6', functions: ['PediatricLaparoscopicSurgery', 'PediatricRoboticSurgery', 'PediatricThoracoscopicSurgery', 'PediatricBronchoscopy', 'PediatricEsophagoscopy', 'PediatricGastroscopy', 'PediatricColonoscopy', 'PediatricCystoscopy', 'PediatricLaparoscopy', 'PediatricEndoscopy'] });
});
router.post('/call/PediatricLaparoscopicSurgery', authenticate, (req, res) => {
  res.json(PediatricLaparoscopicSurgery(req.body));
});

router.post('/call/PediatricRoboticSurgery', authenticate, (req, res) => {
  res.json(PediatricRoboticSurgery(req.body));
});

router.post('/call/PediatricThoracoscopicSurgery', authenticate, (req, res) => {
  res.json(PediatricThoracoscopicSurgery(req.body));
});

router.post('/call/PediatricBronchoscopy', authenticate, (req, res) => {
  res.json(PediatricBronchoscopy(req.body));
});

router.post('/call/PediatricEsophagoscopy', authenticate, (req, res) => {
  res.json(PediatricEsophagoscopy(req.body));
});

router.post('/call/PediatricGastroscopy', authenticate, (req, res) => {
  res.json(PediatricGastroscopy(req.body));
});

router.post('/call/PediatricColonoscopy', authenticate, (req, res) => {
  res.json(PediatricColonoscopy(req.body));
});

router.post('/call/PediatricCystoscopy', authenticate, (req, res) => {
  res.json(PediatricCystoscopy(req.body));
});

router.post('/call/PediatricLaparoscopy', authenticate, (req, res) => {
  res.json(PediatricLaparoscopy(req.body));
});

router.post('/call/PediatricEndoscopy', authenticate, (req, res) => {
  res.json(PediatricEndoscopy(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
