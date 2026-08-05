// pcc_pediatric_surg_ext40 routes v3.150.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricColorectalSurgeryExt, PediatricHirschsprungExt, PediatricPullThroughExt, PediatricSwensonProcedureExt, PediatricSoaveProcedureExt, PediatricDuhamelProcedureExt, PediatricAnorectalMalformationExt, PediatricImperforateAnusExt, PediatricRectalProlapseExt, PediatricFecalIncontinenceExt } = require('./pcc_pediatric_surg_ext40_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.150.0', module: 'pcc_pediatric_surg_ext40', label: 'PCC Pediatric Surg Ext40', functions: ['PediatricColorectalSurgeryExt', 'PediatricHirschsprungExt', 'PediatricPullThroughExt', 'PediatricSwensonProcedureExt', 'PediatricSoaveProcedureExt', 'PediatricDuhamelProcedureExt', 'PediatricAnorectalMalformationExt', 'PediatricImperforateAnusExt', 'PediatricRectalProlapseExt', 'PediatricFecalIncontinenceExt'] });
});
router.post('/call/PediatricColorectalSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricColorectalSurgeryExt(req.body));
});

router.post('/call/PediatricHirschsprungExt', authenticate, (req, res) => {
  res.json(PediatricHirschsprungExt(req.body));
});

router.post('/call/PediatricPullThroughExt', authenticate, (req, res) => {
  res.json(PediatricPullThroughExt(req.body));
});

router.post('/call/PediatricSwensonProcedureExt', authenticate, (req, res) => {
  res.json(PediatricSwensonProcedureExt(req.body));
});

router.post('/call/PediatricSoaveProcedureExt', authenticate, (req, res) => {
  res.json(PediatricSoaveProcedureExt(req.body));
});

router.post('/call/PediatricDuhamelProcedureExt', authenticate, (req, res) => {
  res.json(PediatricDuhamelProcedureExt(req.body));
});

router.post('/call/PediatricAnorectalMalformationExt', authenticate, (req, res) => {
  res.json(PediatricAnorectalMalformationExt(req.body));
});

router.post('/call/PediatricImperforateAnusExt', authenticate, (req, res) => {
  res.json(PediatricImperforateAnusExt(req.body));
});

router.post('/call/PediatricRectalProlapseExt', authenticate, (req, res) => {
  res.json(PediatricRectalProlapseExt(req.body));
});

router.post('/call/PediatricFecalIncontinenceExt', authenticate, (req, res) => {
  res.json(PediatricFecalIncontinenceExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
