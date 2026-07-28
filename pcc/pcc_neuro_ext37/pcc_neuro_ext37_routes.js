// pcc_neuro_ext37 routes v3.136.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { CataplexyExt, SleepOnsetREM, HypnagogicHallucinationsExt, HypnopompicHallucinations, SleepParalysisExt2, REMIntrusionExt, StatusDissociatusExt, SleepRelatedHallucinations, NightmareDisorderExt, IsolatedSleepParalysis } = require('./pcc_neuro_ext37_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.136.0', module: 'pcc_neuro_ext37', label: 'PCC Neuro Ext37', functions: ['CataplexyExt', 'SleepOnsetREM', 'HypnagogicHallucinationsExt', 'HypnopompicHallucinations', 'SleepParalysisExt2', 'REMIntrusionExt', 'StatusDissociatusExt', 'SleepRelatedHallucinations', 'NightmareDisorderExt', 'IsolatedSleepParalysis'] });
});
router.post('/call/CataplexyExt', authenticate, (req, res) => {
  res.json(CataplexyExt(req.body));
});

router.post('/call/SleepOnsetREM', authenticate, (req, res) => {
  res.json(SleepOnsetREM(req.body));
});

router.post('/call/HypnagogicHallucinationsExt', authenticate, (req, res) => {
  res.json(HypnagogicHallucinationsExt(req.body));
});

router.post('/call/HypnopompicHallucinations', authenticate, (req, res) => {
  res.json(HypnopompicHallucinations(req.body));
});

router.post('/call/SleepParalysisExt2', authenticate, (req, res) => {
  res.json(SleepParalysisExt2(req.body));
});

router.post('/call/REMIntrusionExt', authenticate, (req, res) => {
  res.json(REMIntrusionExt(req.body));
});

router.post('/call/StatusDissociatusExt', authenticate, (req, res) => {
  res.json(StatusDissociatusExt(req.body));
});

router.post('/call/SleepRelatedHallucinations', authenticate, (req, res) => {
  res.json(SleepRelatedHallucinations(req.body));
});

router.post('/call/NightmareDisorderExt', authenticate, (req, res) => {
  res.json(NightmareDisorderExt(req.body));
});

router.post('/call/IsolatedSleepParalysis', authenticate, (req, res) => {
  res.json(IsolatedSleepParalysis(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.136.0', module: 'pcc_neuro_ext37', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
