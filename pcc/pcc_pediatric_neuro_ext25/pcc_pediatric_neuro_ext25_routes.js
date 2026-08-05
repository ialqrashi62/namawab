// pcc_pediatric_neuro_ext25 routes v3.135.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricNightTerrorsExt, PediatricSleepwalkingExt, PediatricSleepBruxism, PediatricRestlessLegsExt, PediatricNarcolepsyExt, PediatricKleineLevin, PediatricIdiopathicHypersomniaExt, PediatricDelayedSleepPhase, PediatricAdvancedSleepPhase, PediatricIrregularSleepWake } = require('./pcc_pediatric_neuro_ext25_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.135.0', module: 'pcc_pediatric_neuro_ext25', label: 'PCC Pediatric Neuro Ext25', functions: ['PediatricNightTerrorsExt', 'PediatricSleepwalkingExt', 'PediatricSleepBruxism', 'PediatricRestlessLegsExt', 'PediatricNarcolepsyExt', 'PediatricKleineLevin', 'PediatricIdiopathicHypersomniaExt', 'PediatricDelayedSleepPhase', 'PediatricAdvancedSleepPhase', 'PediatricIrregularSleepWake'] });
});
router.post('/call/PediatricNightTerrorsExt', authenticate, (req, res) => {
  res.json(PediatricNightTerrorsExt(req.body));
});

router.post('/call/PediatricSleepwalkingExt', authenticate, (req, res) => {
  res.json(PediatricSleepwalkingExt(req.body));
});

router.post('/call/PediatricSleepBruxism', authenticate, (req, res) => {
  res.json(PediatricSleepBruxism(req.body));
});

router.post('/call/PediatricRestlessLegsExt', authenticate, (req, res) => {
  res.json(PediatricRestlessLegsExt(req.body));
});

router.post('/call/PediatricNarcolepsyExt', authenticate, (req, res) => {
  res.json(PediatricNarcolepsyExt(req.body));
});

router.post('/call/PediatricKleineLevin', authenticate, (req, res) => {
  res.json(PediatricKleineLevin(req.body));
});

router.post('/call/PediatricIdiopathicHypersomniaExt', authenticate, (req, res) => {
  res.json(PediatricIdiopathicHypersomniaExt(req.body));
});

router.post('/call/PediatricDelayedSleepPhase', authenticate, (req, res) => {
  res.json(PediatricDelayedSleepPhase(req.body));
});

router.post('/call/PediatricAdvancedSleepPhase', authenticate, (req, res) => {
  res.json(PediatricAdvancedSleepPhase(req.body));
});

router.post('/call/PediatricIrregularSleepWake', authenticate, (req, res) => {
  res.json(PediatricIrregularSleepWake(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
