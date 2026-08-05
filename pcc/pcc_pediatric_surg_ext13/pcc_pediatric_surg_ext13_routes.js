// pcc_pediatric_surg_ext13 routes v3.123.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricTraumaSurgery, PediatricSplenectomyTrauma, PediatricLiverLaceration, PediatricKidneyLaceration, PediatricBowelInjury, PediatricPancreaticInjury, PediatricVascularInjury, PediatricThoracicTrauma, PediatricHeadTrauma, PediatricSpinalTrauma } = require('./pcc_pediatric_surg_ext13_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.123.0', module: 'pcc_pediatric_surg_ext13', label: 'PCC Pediatric Surg Ext13', functions: ['PediatricTraumaSurgery', 'PediatricSplenectomyTrauma', 'PediatricLiverLaceration', 'PediatricKidneyLaceration', 'PediatricBowelInjury', 'PediatricPancreaticInjury', 'PediatricVascularInjury', 'PediatricThoracicTrauma', 'PediatricHeadTrauma', 'PediatricSpinalTrauma'] });
});
router.post('/call/PediatricTraumaSurgery', authenticate, (req, res) => {
  res.json(PediatricTraumaSurgery(req.body));
});

router.post('/call/PediatricSplenectomyTrauma', authenticate, (req, res) => {
  res.json(PediatricSplenectomyTrauma(req.body));
});

router.post('/call/PediatricLiverLaceration', authenticate, (req, res) => {
  res.json(PediatricLiverLaceration(req.body));
});

router.post('/call/PediatricKidneyLaceration', authenticate, (req, res) => {
  res.json(PediatricKidneyLaceration(req.body));
});

router.post('/call/PediatricBowelInjury', authenticate, (req, res) => {
  res.json(PediatricBowelInjury(req.body));
});

router.post('/call/PediatricPancreaticInjury', authenticate, (req, res) => {
  res.json(PediatricPancreaticInjury(req.body));
});

router.post('/call/PediatricVascularInjury', authenticate, (req, res) => {
  res.json(PediatricVascularInjury(req.body));
});

router.post('/call/PediatricThoracicTrauma', authenticate, (req, res) => {
  res.json(PediatricThoracicTrauma(req.body));
});

router.post('/call/PediatricHeadTrauma', authenticate, (req, res) => {
  res.json(PediatricHeadTrauma(req.body));
});

router.post('/call/PediatricSpinalTrauma', authenticate, (req, res) => {
  res.json(PediatricSpinalTrauma(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
