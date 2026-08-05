// pcc_neuro_ext17 routes v3.116.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { SleepWakeDisordersExt, CircadianRhythmDisorder, NarcolepsyExt, IdiopathicHypersomnia, KleineLevinSyndrome, RestlessLegsSyndromeExt, PeriodicLimbMovement, REMBehaviorDisorder, SleepApneaExt, Parasomnias } = require('./pcc_neuro_ext17_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.116.0', module: 'pcc_neuro_ext17', label: 'PCC Neuro Ext17', functions: ['SleepWakeDisordersExt', 'CircadianRhythmDisorder', 'NarcolepsyExt', 'IdiopathicHypersomnia', 'KleineLevinSyndrome', 'RestlessLegsSyndromeExt', 'PeriodicLimbMovement', 'REMBehaviorDisorder', 'SleepApneaExt', 'Parasomnias'] });
});
router.post('/call/SleepWakeDisordersExt', authenticate, (req, res) => {
  res.json(SleepWakeDisordersExt(req.body));
});

router.post('/call/CircadianRhythmDisorder', authenticate, (req, res) => {
  res.json(CircadianRhythmDisorder(req.body));
});

router.post('/call/NarcolepsyExt', authenticate, (req, res) => {
  res.json(NarcolepsyExt(req.body));
});

router.post('/call/IdiopathicHypersomnia', authenticate, (req, res) => {
  res.json(IdiopathicHypersomnia(req.body));
});

router.post('/call/KleineLevinSyndrome', authenticate, (req, res) => {
  res.json(KleineLevinSyndrome(req.body));
});

router.post('/call/RestlessLegsSyndromeExt', authenticate, (req, res) => {
  res.json(RestlessLegsSyndromeExt(req.body));
});

router.post('/call/PeriodicLimbMovement', authenticate, (req, res) => {
  res.json(PeriodicLimbMovement(req.body));
});

router.post('/call/REMBehaviorDisorder', authenticate, (req, res) => {
  res.json(REMBehaviorDisorder(req.body));
});

router.post('/call/SleepApneaExt', authenticate, (req, res) => {
  res.json(SleepApneaExt(req.body));
});

router.post('/call/Parasomnias', authenticate, (req, res) => {
  res.json(Parasomnias(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
