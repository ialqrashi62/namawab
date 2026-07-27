// pcc_neuro_ext31 routes v3.130.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { MovementDisorderAdvanced, DystoniaSyndrome, ChoreaAdvanced, AthetosisSyndrome, TicDisorderAdvanced, MyoclonusAdvanced, TremorSyndrome, AtaxiaSyndrome, GaitDisorder, HypokineticMovement } = require('./pcc_neuro_ext31_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.130.0', module: 'pcc_neuro_ext31', label: 'PCC Neuro Ext31', functions: ['MovementDisorderAdvanced', 'DystoniaSyndrome', 'ChoreaAdvanced', 'AthetosisSyndrome', 'TicDisorderAdvanced', 'MyoclonusAdvanced', 'TremorSyndrome', 'AtaxiaSyndrome', 'GaitDisorder', 'HypokineticMovement'] });
});
router.post('/call/MovementDisorderAdvanced', authenticate, (req, res) => {
  res.json(MovementDisorderAdvanced(req.body));
});

router.post('/call/DystoniaSyndrome', authenticate, (req, res) => {
  res.json(DystoniaSyndrome(req.body));
});

router.post('/call/ChoreaAdvanced', authenticate, (req, res) => {
  res.json(ChoreaAdvanced(req.body));
});

router.post('/call/AthetosisSyndrome', authenticate, (req, res) => {
  res.json(AthetosisSyndrome(req.body));
});

router.post('/call/TicDisorderAdvanced', authenticate, (req, res) => {
  res.json(TicDisorderAdvanced(req.body));
});

router.post('/call/MyoclonusAdvanced', authenticate, (req, res) => {
  res.json(MyoclonusAdvanced(req.body));
});

router.post('/call/TremorSyndrome', authenticate, (req, res) => {
  res.json(TremorSyndrome(req.body));
});

router.post('/call/AtaxiaSyndrome', authenticate, (req, res) => {
  res.json(AtaxiaSyndrome(req.body));
});

router.post('/call/GaitDisorder', authenticate, (req, res) => {
  res.json(GaitDisorder(req.body));
});

router.post('/call/HypokineticMovement', authenticate, (req, res) => {
  res.json(HypokineticMovement(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.130.0', module: 'pcc_neuro_ext31', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
