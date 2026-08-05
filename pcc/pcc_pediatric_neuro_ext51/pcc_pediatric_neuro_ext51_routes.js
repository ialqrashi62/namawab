// pcc_pediatric_neuro_ext51 routes v3.161.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricPseudotumorCerebriExt, PediatricIIHExt, PediatricEmptySellaExt, PediatricCSFPressureDisorderExt, PediatricCSFLeakExt, PediatricCSFVenousFistulaExt, PediatricShuntMalfunctionExt, PediatricShuntInfectionExt, PediatricVentriculomegalyExt, PediatricArachnoidCystExt } = require('./pcc_pediatric_neuro_ext51_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.161.0', module: 'pcc_pediatric_neuro_ext51', label: 'PCC Pediatric Neuro Ext51', functions: ['PediatricPseudotumorCerebriExt', 'PediatricIIHExt', 'PediatricEmptySellaExt', 'PediatricCSFPressureDisorderExt', 'PediatricCSFLeakExt', 'PediatricCSFVenousFistulaExt', 'PediatricShuntMalfunctionExt', 'PediatricShuntInfectionExt', 'PediatricVentriculomegalyExt', 'PediatricArachnoidCystExt'] });
});
router.post('/call/PediatricPseudotumorCerebriExt', authenticate, (req, res) => {
  res.json(PediatricPseudotumorCerebriExt(req.body));
});

router.post('/call/PediatricIIHExt', authenticate, (req, res) => {
  res.json(PediatricIIHExt(req.body));
});

router.post('/call/PediatricEmptySellaExt', authenticate, (req, res) => {
  res.json(PediatricEmptySellaExt(req.body));
});

router.post('/call/PediatricCSFPressureDisorderExt', authenticate, (req, res) => {
  res.json(PediatricCSFPressureDisorderExt(req.body));
});

router.post('/call/PediatricCSFLeakExt', authenticate, (req, res) => {
  res.json(PediatricCSFLeakExt(req.body));
});

router.post('/call/PediatricCSFVenousFistulaExt', authenticate, (req, res) => {
  res.json(PediatricCSFVenousFistulaExt(req.body));
});

router.post('/call/PediatricShuntMalfunctionExt', authenticate, (req, res) => {
  res.json(PediatricShuntMalfunctionExt(req.body));
});

router.post('/call/PediatricShuntInfectionExt', authenticate, (req, res) => {
  res.json(PediatricShuntInfectionExt(req.body));
});

router.post('/call/PediatricVentriculomegalyExt', authenticate, (req, res) => {
  res.json(PediatricVentriculomegalyExt(req.body));
});

router.post('/call/PediatricArachnoidCystExt', authenticate, (req, res) => {
  res.json(PediatricArachnoidCystExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
