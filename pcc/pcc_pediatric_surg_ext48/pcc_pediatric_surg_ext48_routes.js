// pcc_pediatric_surg_ext48 routes v3.158.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricEndocrineSurgeryExt, PediatricThyroidectomyTotalExt, PediatricThyroidectomyPartialExt, PediatricAdrenalectomyExt, PediatricPituitarySurgeryExt, PediatricParathyroidSurgeryExt, PediatricPancreaticSurgeryExt, PediatricInsulinomaExt, PediatricGastrinomaExt, PediatricVIPomaExt } = require('./pcc_pediatric_surg_ext48_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.158.0', module: 'pcc_pediatric_surg_ext48', label: 'PCC Pediatric Surg Ext48', functions: ['PediatricEndocrineSurgeryExt', 'PediatricThyroidectomyTotalExt', 'PediatricThyroidectomyPartialExt', 'PediatricAdrenalectomyExt', 'PediatricPituitarySurgeryExt', 'PediatricParathyroidSurgeryExt', 'PediatricPancreaticSurgeryExt', 'PediatricInsulinomaExt', 'PediatricGastrinomaExt', 'PediatricVIPomaExt'] });
});
router.post('/call/PediatricEndocrineSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricEndocrineSurgeryExt(req.body));
});

router.post('/call/PediatricThyroidectomyTotalExt', authenticate, (req, res) => {
  res.json(PediatricThyroidectomyTotalExt(req.body));
});

router.post('/call/PediatricThyroidectomyPartialExt', authenticate, (req, res) => {
  res.json(PediatricThyroidectomyPartialExt(req.body));
});

router.post('/call/PediatricAdrenalectomyExt', authenticate, (req, res) => {
  res.json(PediatricAdrenalectomyExt(req.body));
});

router.post('/call/PediatricPituitarySurgeryExt', authenticate, (req, res) => {
  res.json(PediatricPituitarySurgeryExt(req.body));
});

router.post('/call/PediatricParathyroidSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricParathyroidSurgeryExt(req.body));
});

router.post('/call/PediatricPancreaticSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricPancreaticSurgeryExt(req.body));
});

router.post('/call/PediatricInsulinomaExt', authenticate, (req, res) => {
  res.json(PediatricInsulinomaExt(req.body));
});

router.post('/call/PediatricGastrinomaExt', authenticate, (req, res) => {
  res.json(PediatricGastrinomaExt(req.body));
});

router.post('/call/PediatricVIPomaExt', authenticate, (req, res) => {
  res.json(PediatricVIPomaExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
