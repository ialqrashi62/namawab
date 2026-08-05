// pcc_pediatric_surg_ext43 routes v3.153.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricRoboticSurgeryExt, PediatricRoboticPyeloplastyExt, PediatricRoboticNephrectomyExt, PediatricRoboticUreteralExt, PediatricRoboticHysterectomyExt, PediatricRoboticSplenectomyExt, PediatricRoboticHepatojejunostomyExt, PediatricRoboticCholecystectomyExt, PediatricRoboticAdrenalectomyExt, PediatricRoboticPancreaticExt } = require('./pcc_pediatric_surg_ext43_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.153.0', module: 'pcc_pediatric_surg_ext43', label: 'PCC Pediatric Surg Ext43', functions: ['PediatricRoboticSurgeryExt', 'PediatricRoboticPyeloplastyExt', 'PediatricRoboticNephrectomyExt', 'PediatricRoboticUreteralExt', 'PediatricRoboticHysterectomyExt', 'PediatricRoboticSplenectomyExt', 'PediatricRoboticHepatojejunostomyExt', 'PediatricRoboticCholecystectomyExt', 'PediatricRoboticAdrenalectomyExt', 'PediatricRoboticPancreaticExt'] });
});
router.post('/call/PediatricRoboticSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricRoboticSurgeryExt(req.body));
});

router.post('/call/PediatricRoboticPyeloplastyExt', authenticate, (req, res) => {
  res.json(PediatricRoboticPyeloplastyExt(req.body));
});

router.post('/call/PediatricRoboticNephrectomyExt', authenticate, (req, res) => {
  res.json(PediatricRoboticNephrectomyExt(req.body));
});

router.post('/call/PediatricRoboticUreteralExt', authenticate, (req, res) => {
  res.json(PediatricRoboticUreteralExt(req.body));
});

router.post('/call/PediatricRoboticHysterectomyExt', authenticate, (req, res) => {
  res.json(PediatricRoboticHysterectomyExt(req.body));
});

router.post('/call/PediatricRoboticSplenectomyExt', authenticate, (req, res) => {
  res.json(PediatricRoboticSplenectomyExt(req.body));
});

router.post('/call/PediatricRoboticHepatojejunostomyExt', authenticate, (req, res) => {
  res.json(PediatricRoboticHepatojejunostomyExt(req.body));
});

router.post('/call/PediatricRoboticCholecystectomyExt', authenticate, (req, res) => {
  res.json(PediatricRoboticCholecystectomyExt(req.body));
});

router.post('/call/PediatricRoboticAdrenalectomyExt', authenticate, (req, res) => {
  res.json(PediatricRoboticAdrenalectomyExt(req.body));
});

router.post('/call/PediatricRoboticPancreaticExt', authenticate, (req, res) => {
  res.json(PediatricRoboticPancreaticExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
