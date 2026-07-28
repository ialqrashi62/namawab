// pcc_neuro_ext46 routes v3.145.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { BellPalsyExt2, RamsayHuntSyndromeExt, MelkerssonRosenthalExt, HeerfordtSyndromeExt, HemifacialSpasmExt, FacialMyokymiaExt, FacialSynkinesisExt, TrigeminalMotorNeuropathyExt, AbducensNervePalsyExt, TrochlearNervePalsyExt } = require('./pcc_neuro_ext46_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.145.0', module: 'pcc_neuro_ext46', label: 'PCC Neuro Ext46', functions: ['BellPalsyExt2', 'RamsayHuntSyndromeExt', 'MelkerssonRosenthalExt', 'HeerfordtSyndromeExt', 'HemifacialSpasmExt', 'FacialMyokymiaExt', 'FacialSynkinesisExt', 'TrigeminalMotorNeuropathyExt', 'AbducensNervePalsyExt', 'TrochlearNervePalsyExt'] });
});
router.post('/call/BellPalsyExt2', authenticate, (req, res) => {
  res.json(BellPalsyExt2(req.body));
});

router.post('/call/RamsayHuntSyndromeExt', authenticate, (req, res) => {
  res.json(RamsayHuntSyndromeExt(req.body));
});

router.post('/call/MelkerssonRosenthalExt', authenticate, (req, res) => {
  res.json(MelkerssonRosenthalExt(req.body));
});

router.post('/call/HeerfordtSyndromeExt', authenticate, (req, res) => {
  res.json(HeerfordtSyndromeExt(req.body));
});

router.post('/call/HemifacialSpasmExt', authenticate, (req, res) => {
  res.json(HemifacialSpasmExt(req.body));
});

router.post('/call/FacialMyokymiaExt', authenticate, (req, res) => {
  res.json(FacialMyokymiaExt(req.body));
});

router.post('/call/FacialSynkinesisExt', authenticate, (req, res) => {
  res.json(FacialSynkinesisExt(req.body));
});

router.post('/call/TrigeminalMotorNeuropathyExt', authenticate, (req, res) => {
  res.json(TrigeminalMotorNeuropathyExt(req.body));
});

router.post('/call/AbducensNervePalsyExt', authenticate, (req, res) => {
  res.json(AbducensNervePalsyExt(req.body));
});

router.post('/call/TrochlearNervePalsyExt', authenticate, (req, res) => {
  res.json(TrochlearNervePalsyExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.145.0', module: 'pcc_neuro_ext46', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
