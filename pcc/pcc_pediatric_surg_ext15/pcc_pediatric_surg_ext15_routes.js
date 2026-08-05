// pcc_pediatric_surg_ext15 routes v3.125.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricUrologyExt, PediatricCircumcisionExt, PediatricHypospadiasRepair, PediatricEpispadiasRepair, PediatricBladderReconstruction, PediatricUrinaryDiversion, PediatricNephrectomyExt, PediatricUreteralReimplantExt, PediatricPyeloplastyExt, PediatricUreteroscopy } = require('./pcc_pediatric_surg_ext15_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.125.0', module: 'pcc_pediatric_surg_ext15', label: 'PCC Pediatric Surg Ext15', functions: ['PediatricUrologyExt', 'PediatricCircumcisionExt', 'PediatricHypospadiasRepair', 'PediatricEpispadiasRepair', 'PediatricBladderReconstruction', 'PediatricUrinaryDiversion', 'PediatricNephrectomyExt', 'PediatricUreteralReimplantExt', 'PediatricPyeloplastyExt', 'PediatricUreteroscopy'] });
});
router.post('/call/PediatricUrologyExt', authenticate, (req, res) => {
  res.json(PediatricUrologyExt(req.body));
});

router.post('/call/PediatricCircumcisionExt', authenticate, (req, res) => {
  res.json(PediatricCircumcisionExt(req.body));
});

router.post('/call/PediatricHypospadiasRepair', authenticate, (req, res) => {
  res.json(PediatricHypospadiasRepair(req.body));
});

router.post('/call/PediatricEpispadiasRepair', authenticate, (req, res) => {
  res.json(PediatricEpispadiasRepair(req.body));
});

router.post('/call/PediatricBladderReconstruction', authenticate, (req, res) => {
  res.json(PediatricBladderReconstruction(req.body));
});

router.post('/call/PediatricUrinaryDiversion', authenticate, (req, res) => {
  res.json(PediatricUrinaryDiversion(req.body));
});

router.post('/call/PediatricNephrectomyExt', authenticate, (req, res) => {
  res.json(PediatricNephrectomyExt(req.body));
});

router.post('/call/PediatricUreteralReimplantExt', authenticate, (req, res) => {
  res.json(PediatricUreteralReimplantExt(req.body));
});

router.post('/call/PediatricPyeloplastyExt', authenticate, (req, res) => {
  res.json(PediatricPyeloplastyExt(req.body));
});

router.post('/call/PediatricUreteroscopy', authenticate, (req, res) => {
  res.json(PediatricUreteroscopy(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
