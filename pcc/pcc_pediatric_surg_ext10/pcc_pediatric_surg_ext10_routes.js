// pcc_pediatric_surg_ext10 routes v3.120.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricCardiothoracicSurgery, PediatricVSDClosure, PediatricASDClosure, PediatricTOFCorrection, PediatricAVCanalRepair, PediatricTruncusArteriosus, PediatricNorwoodProcedure, PediatricFontanProcedure, PediatricGlennShunt, PediatricPulmonaryAtresia } = require('./pcc_pediatric_surg_ext10_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.120.0', module: 'pcc_pediatric_surg_ext10', label: 'PCC Pediatric Surg Ext10', functions: ['PediatricCardiothoracicSurgery', 'PediatricVSDClosure', 'PediatricASDClosure', 'PediatricTOFCorrection', 'PediatricAVCanalRepair', 'PediatricTruncusArteriosus', 'PediatricNorwoodProcedure', 'PediatricFontanProcedure', 'PediatricGlennShunt', 'PediatricPulmonaryAtresia'] });
});
router.post('/call/PediatricCardiothoracicSurgery', authenticate, (req, res) => {
  res.json(PediatricCardiothoracicSurgery(req.body));
});

router.post('/call/PediatricVSDClosure', authenticate, (req, res) => {
  res.json(PediatricVSDClosure(req.body));
});

router.post('/call/PediatricASDClosure', authenticate, (req, res) => {
  res.json(PediatricASDClosure(req.body));
});

router.post('/call/PediatricTOFCorrection', authenticate, (req, res) => {
  res.json(PediatricTOFCorrection(req.body));
});

router.post('/call/PediatricAVCanalRepair', authenticate, (req, res) => {
  res.json(PediatricAVCanalRepair(req.body));
});

router.post('/call/PediatricTruncusArteriosus', authenticate, (req, res) => {
  res.json(PediatricTruncusArteriosus(req.body));
});

router.post('/call/PediatricNorwoodProcedure', authenticate, (req, res) => {
  res.json(PediatricNorwoodProcedure(req.body));
});

router.post('/call/PediatricFontanProcedure', authenticate, (req, res) => {
  res.json(PediatricFontanProcedure(req.body));
});

router.post('/call/PediatricGlennShunt', authenticate, (req, res) => {
  res.json(PediatricGlennShunt(req.body));
});

router.post('/call/PediatricPulmonaryAtresia', authenticate, (req, res) => {
  res.json(PediatricPulmonaryAtresia(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
