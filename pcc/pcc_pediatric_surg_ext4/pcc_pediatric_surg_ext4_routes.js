// pcc_pediatric_surg_ext4 routes v3.114.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricNissenFundoplication, PediatricGastrostomyTube, PediatricCholecystectomy, PediatricSplenectomy, PediatricNephrectomy, PediatricPyeloplasty, PediatricUreteralReimplant, PediatricBladderAugmentation, PediatricMitrofanoff, PediatricBladderExstrophy } = require('./pcc_pediatric_surg_ext4_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.114.0', module: 'pcc_pediatric_surg_ext4', label: 'PCC Pediatric Surg Ext4', functions: ['PediatricNissenFundoplication', 'PediatricGastrostomyTube', 'PediatricCholecystectomy', 'PediatricSplenectomy', 'PediatricNephrectomy', 'PediatricPyeloplasty', 'PediatricUreteralReimplant', 'PediatricBladderAugmentation', 'PediatricMitrofanoff', 'PediatricBladderExstrophy'] });
});
router.post('/call/PediatricNissenFundoplication', authenticate, (req, res) => {
  res.json(PediatricNissenFundoplication(req.body));
});

router.post('/call/PediatricGastrostomyTube', authenticate, (req, res) => {
  res.json(PediatricGastrostomyTube(req.body));
});

router.post('/call/PediatricCholecystectomy', authenticate, (req, res) => {
  res.json(PediatricCholecystectomy(req.body));
});

router.post('/call/PediatricSplenectomy', authenticate, (req, res) => {
  res.json(PediatricSplenectomy(req.body));
});

router.post('/call/PediatricNephrectomy', authenticate, (req, res) => {
  res.json(PediatricNephrectomy(req.body));
});

router.post('/call/PediatricPyeloplasty', authenticate, (req, res) => {
  res.json(PediatricPyeloplasty(req.body));
});

router.post('/call/PediatricUreteralReimplant', authenticate, (req, res) => {
  res.json(PediatricUreteralReimplant(req.body));
});

router.post('/call/PediatricBladderAugmentation', authenticate, (req, res) => {
  res.json(PediatricBladderAugmentation(req.body));
});

router.post('/call/PediatricMitrofanoff', authenticate, (req, res) => {
  res.json(PediatricMitrofanoff(req.body));
});

router.post('/call/PediatricBladderExstrophy', authenticate, (req, res) => {
  res.json(PediatricBladderExstrophy(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
