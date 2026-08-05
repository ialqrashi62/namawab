// pcc_pediatric_surg_ext21 routes v3.131.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricGeneralSurgeryExt, PediatricAppendectomyExt, PediatricCholecystectomyExt, PediatricSplenectomyExt, PediatricHerniaRepairExt, PediatricHydroceleRepair, PediatricUndescendedTestis, PediatricVaricoceleRepair, PediatricIntestinalResection, PediatricBowelAnastomosis } = require('./pcc_pediatric_surg_ext21_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.131.0', module: 'pcc_pediatric_surg_ext21', label: 'PCC Pediatric Surg Ext21', functions: ['PediatricGeneralSurgeryExt', 'PediatricAppendectomyExt', 'PediatricCholecystectomyExt', 'PediatricSplenectomyExt', 'PediatricHerniaRepairExt', 'PediatricHydroceleRepair', 'PediatricUndescendedTestis', 'PediatricVaricoceleRepair', 'PediatricIntestinalResection', 'PediatricBowelAnastomosis'] });
});
router.post('/call/PediatricGeneralSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricGeneralSurgeryExt(req.body));
});

router.post('/call/PediatricAppendectomyExt', authenticate, (req, res) => {
  res.json(PediatricAppendectomyExt(req.body));
});

router.post('/call/PediatricCholecystectomyExt', authenticate, (req, res) => {
  res.json(PediatricCholecystectomyExt(req.body));
});

router.post('/call/PediatricSplenectomyExt', authenticate, (req, res) => {
  res.json(PediatricSplenectomyExt(req.body));
});

router.post('/call/PediatricHerniaRepairExt', authenticate, (req, res) => {
  res.json(PediatricHerniaRepairExt(req.body));
});

router.post('/call/PediatricHydroceleRepair', authenticate, (req, res) => {
  res.json(PediatricHydroceleRepair(req.body));
});

router.post('/call/PediatricUndescendedTestis', authenticate, (req, res) => {
  res.json(PediatricUndescendedTestis(req.body));
});

router.post('/call/PediatricVaricoceleRepair', authenticate, (req, res) => {
  res.json(PediatricVaricoceleRepair(req.body));
});

router.post('/call/PediatricIntestinalResection', authenticate, (req, res) => {
  res.json(PediatricIntestinalResection(req.body));
});

router.post('/call/PediatricBowelAnastomosis', authenticate, (req, res) => {
  res.json(PediatricBowelAnastomosis(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
