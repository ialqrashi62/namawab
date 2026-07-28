// pcc_pediatric_surg_ext31 routes v3.141.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricCardiothoracicExt, PediatricVSDRepairExt, PediatricASDRepairExt, PediatricAVCanalRepair, PediatricTOFRrepairExt, PediatricCoarctationRepair, PediatricBTShuntExt, PediatricGlennProcedureExt, PediatricFontanProcedureExt, PediatricHeartTransplantPedExt } = require('./pcc_pediatric_surg_ext31_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.141.0', module: 'pcc_pediatric_surg_ext31', label: 'PCC Pediatric Surg Ext31', functions: ['PediatricCardiothoracicExt', 'PediatricVSDRepairExt', 'PediatricASDRepairExt', 'PediatricAVCanalRepair', 'PediatricTOFRrepairExt', 'PediatricCoarctationRepair', 'PediatricBTShuntExt', 'PediatricGlennProcedureExt', 'PediatricFontanProcedureExt', 'PediatricHeartTransplantPedExt'] });
});
router.post('/call/PediatricCardiothoracicExt', authenticate, (req, res) => {
  res.json(PediatricCardiothoracicExt(req.body));
});

router.post('/call/PediatricVSDRepairExt', authenticate, (req, res) => {
  res.json(PediatricVSDRepairExt(req.body));
});

router.post('/call/PediatricASDRepairExt', authenticate, (req, res) => {
  res.json(PediatricASDRepairExt(req.body));
});

router.post('/call/PediatricAVCanalRepair', authenticate, (req, res) => {
  res.json(PediatricAVCanalRepair(req.body));
});

router.post('/call/PediatricTOFRrepairExt', authenticate, (req, res) => {
  res.json(PediatricTOFRrepairExt(req.body));
});

router.post('/call/PediatricCoarctationRepair', authenticate, (req, res) => {
  res.json(PediatricCoarctationRepair(req.body));
});

router.post('/call/PediatricBTShuntExt', authenticate, (req, res) => {
  res.json(PediatricBTShuntExt(req.body));
});

router.post('/call/PediatricGlennProcedureExt', authenticate, (req, res) => {
  res.json(PediatricGlennProcedureExt(req.body));
});

router.post('/call/PediatricFontanProcedureExt', authenticate, (req, res) => {
  res.json(PediatricFontanProcedureExt(req.body));
});

router.post('/call/PediatricHeartTransplantPedExt', authenticate, (req, res) => {
  res.json(PediatricHeartTransplantPedExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.141.0', module: 'pcc_pediatric_surg_ext31', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
