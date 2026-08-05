// pcc_pediatric_neuro_ext27 routes v3.137.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricEpilepsyExt3, PediatricFebrileSeizureExt, PediatricChildhoodAbsence, PediatricJuvenileMyoclonic, PediatricLennoxGastautExt, PediatricWestSyndromeExt, PediatricDravetSyndromeExt, PediatricLandauKleffnerExt, PediatricCSWSyndromeExt, PediatricMyoclonicAstatic } = require('./pcc_pediatric_neuro_ext27_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.137.0', module: 'pcc_pediatric_neuro_ext27', label: 'PCC Pediatric Neuro Ext27', functions: ['PediatricEpilepsyExt3', 'PediatricFebrileSeizureExt', 'PediatricChildhoodAbsence', 'PediatricJuvenileMyoclonic', 'PediatricLennoxGastautExt', 'PediatricWestSyndromeExt', 'PediatricDravetSyndromeExt', 'PediatricLandauKleffnerExt', 'PediatricCSWSyndromeExt', 'PediatricMyoclonicAstatic'] });
});
router.post('/call/PediatricEpilepsyExt3', authenticate, (req, res) => {
  res.json(PediatricEpilepsyExt3(req.body));
});

router.post('/call/PediatricFebrileSeizureExt', authenticate, (req, res) => {
  res.json(PediatricFebrileSeizureExt(req.body));
});

router.post('/call/PediatricChildhoodAbsence', authenticate, (req, res) => {
  res.json(PediatricChildhoodAbsence(req.body));
});

router.post('/call/PediatricJuvenileMyoclonic', authenticate, (req, res) => {
  res.json(PediatricJuvenileMyoclonic(req.body));
});

router.post('/call/PediatricLennoxGastautExt', authenticate, (req, res) => {
  res.json(PediatricLennoxGastautExt(req.body));
});

router.post('/call/PediatricWestSyndromeExt', authenticate, (req, res) => {
  res.json(PediatricWestSyndromeExt(req.body));
});

router.post('/call/PediatricDravetSyndromeExt', authenticate, (req, res) => {
  res.json(PediatricDravetSyndromeExt(req.body));
});

router.post('/call/PediatricLandauKleffnerExt', authenticate, (req, res) => {
  res.json(PediatricLandauKleffnerExt(req.body));
});

router.post('/call/PediatricCSWSyndromeExt', authenticate, (req, res) => {
  res.json(PediatricCSWSyndromeExt(req.body));
});

router.post('/call/PediatricMyoclonicAstatic', authenticate, (req, res) => {
  res.json(PediatricMyoclonicAstatic(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
