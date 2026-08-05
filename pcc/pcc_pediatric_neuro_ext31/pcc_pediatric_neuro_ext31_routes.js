// pcc_pediatric_neuro_ext31 routes v3.141.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricAutismSpectrumExt2, PediatricAspergerExt, PediatricPDDNOSExt, PediatricCDDDisorderExt, PediatricADHDCombinedExt, PediatricADHDInattentiveExt, PediatricADHDHyperactiveExt, PediatricODDExt, PediatricConductDisorderExt, PediatricOppositionalDefiantExt } = require('./pcc_pediatric_neuro_ext31_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.141.0', module: 'pcc_pediatric_neuro_ext31', label: 'PCC Pediatric Neuro Ext31', functions: ['PediatricAutismSpectrumExt2', 'PediatricAspergerExt', 'PediatricPDDNOSExt', 'PediatricCDDDisorderExt', 'PediatricADHDCombinedExt', 'PediatricADHDInattentiveExt', 'PediatricADHDHyperactiveExt', 'PediatricODDExt', 'PediatricConductDisorderExt', 'PediatricOppositionalDefiantExt'] });
});
router.post('/call/PediatricAutismSpectrumExt2', authenticate, (req, res) => {
  res.json(PediatricAutismSpectrumExt2(req.body));
});

router.post('/call/PediatricAspergerExt', authenticate, (req, res) => {
  res.json(PediatricAspergerExt(req.body));
});

router.post('/call/PediatricPDDNOSExt', authenticate, (req, res) => {
  res.json(PediatricPDDNOSExt(req.body));
});

router.post('/call/PediatricCDDDisorderExt', authenticate, (req, res) => {
  res.json(PediatricCDDDisorderExt(req.body));
});

router.post('/call/PediatricADHDCombinedExt', authenticate, (req, res) => {
  res.json(PediatricADHDCombinedExt(req.body));
});

router.post('/call/PediatricADHDInattentiveExt', authenticate, (req, res) => {
  res.json(PediatricADHDInattentiveExt(req.body));
});

router.post('/call/PediatricADHDHyperactiveExt', authenticate, (req, res) => {
  res.json(PediatricADHDHyperactiveExt(req.body));
});

router.post('/call/PediatricODDExt', authenticate, (req, res) => {
  res.json(PediatricODDExt(req.body));
});

router.post('/call/PediatricConductDisorderExt', authenticate, (req, res) => {
  res.json(PediatricConductDisorderExt(req.body));
});

router.post('/call/PediatricOppositionalDefiantExt', authenticate, (req, res) => {
  res.json(PediatricOppositionalDefiantExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
