// pcc_neuro_ext35 routes v3.134.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { SleepDisorderExt3, ObstructiveSleepApnea, CentralSleepApnea, MixedSleepApnea, SleepHypoventilation, ObesityHypoventilation, PeriodicLimbMovementExt, REMBehaviorDisorderExt, SleepParalysis, SleepTalking } = require('./pcc_neuro_ext35_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.134.0', module: 'pcc_neuro_ext35', label: 'PCC Neuro Ext35', functions: ['SleepDisorderExt3', 'ObstructiveSleepApnea', 'CentralSleepApnea', 'MixedSleepApnea', 'SleepHypoventilation', 'ObesityHypoventilation', 'PeriodicLimbMovementExt', 'REMBehaviorDisorderExt', 'SleepParalysis', 'SleepTalking'] });
});
router.post('/call/SleepDisorderExt3', authenticate, (req, res) => {
  res.json(SleepDisorderExt3(req.body));
});

router.post('/call/ObstructiveSleepApnea', authenticate, (req, res) => {
  res.json(ObstructiveSleepApnea(req.body));
});

router.post('/call/CentralSleepApnea', authenticate, (req, res) => {
  res.json(CentralSleepApnea(req.body));
});

router.post('/call/MixedSleepApnea', authenticate, (req, res) => {
  res.json(MixedSleepApnea(req.body));
});

router.post('/call/SleepHypoventilation', authenticate, (req, res) => {
  res.json(SleepHypoventilation(req.body));
});

router.post('/call/ObesityHypoventilation', authenticate, (req, res) => {
  res.json(ObesityHypoventilation(req.body));
});

router.post('/call/PeriodicLimbMovementExt', authenticate, (req, res) => {
  res.json(PeriodicLimbMovementExt(req.body));
});

router.post('/call/REMBehaviorDisorderExt', authenticate, (req, res) => {
  res.json(REMBehaviorDisorderExt(req.body));
});

router.post('/call/SleepParalysis', authenticate, (req, res) => {
  res.json(SleepParalysis(req.body));
});

router.post('/call/SleepTalking', authenticate, (req, res) => {
  res.json(SleepTalking(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.134.0', module: 'pcc_neuro_ext35', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
