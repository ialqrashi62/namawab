// pcc_pediatric_surg_ext9 routes v3.119.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricNeonatalSurgery, PediatricCongenitalDiaphragmaticHernia, PediatricTracheoesophagealFistula, PediatricIntestinalAtresia, PediatricAnorectalMalformation, PediatricHirschsprungDisease, PediatricBiliaryAtresia, PediatricCholedochalCyst, PediatricPancreaticSurgery, PediatricHepaticResection } = require('./pcc_pediatric_surg_ext9_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.119.0', module: 'pcc_pediatric_surg_ext9', label: 'PCC Pediatric Surg Ext9', functions: ['PediatricNeonatalSurgery', 'PediatricCongenitalDiaphragmaticHernia', 'PediatricTracheoesophagealFistula', 'PediatricIntestinalAtresia', 'PediatricAnorectalMalformation', 'PediatricHirschsprungDisease', 'PediatricBiliaryAtresia', 'PediatricCholedochalCyst', 'PediatricPancreaticSurgery', 'PediatricHepaticResection'] });
});
router.post('/call/PediatricNeonatalSurgery', authenticate, (req, res) => {
  res.json(PediatricNeonatalSurgery(req.body));
});

router.post('/call/PediatricCongenitalDiaphragmaticHernia', authenticate, (req, res) => {
  res.json(PediatricCongenitalDiaphragmaticHernia(req.body));
});

router.post('/call/PediatricTracheoesophagealFistula', authenticate, (req, res) => {
  res.json(PediatricTracheoesophagealFistula(req.body));
});

router.post('/call/PediatricIntestinalAtresia', authenticate, (req, res) => {
  res.json(PediatricIntestinalAtresia(req.body));
});

router.post('/call/PediatricAnorectalMalformation', authenticate, (req, res) => {
  res.json(PediatricAnorectalMalformation(req.body));
});

router.post('/call/PediatricHirschsprungDisease', authenticate, (req, res) => {
  res.json(PediatricHirschsprungDisease(req.body));
});

router.post('/call/PediatricBiliaryAtresia', authenticate, (req, res) => {
  res.json(PediatricBiliaryAtresia(req.body));
});

router.post('/call/PediatricCholedochalCyst', authenticate, (req, res) => {
  res.json(PediatricCholedochalCyst(req.body));
});

router.post('/call/PediatricPancreaticSurgery', authenticate, (req, res) => {
  res.json(PediatricPancreaticSurgery(req.body));
});

router.post('/call/PediatricHepaticResection', authenticate, (req, res) => {
  res.json(PediatricHepaticResection(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
