// pcc_neuro_ext39 routes v3.138.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { MyastheniaGravisExt, LambertEatonMyasthenicExt, CongenitalMyasthenicExt, BotulismExt2, TetanusExt2, NeurolepticMalignantExt, MalignantHyperthermiaExt, SerotoninSyndromeExt, AnticholinergicToxicityExt, CholinergicCrisisExt } = require('./pcc_neuro_ext39_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.138.0', module: 'pcc_neuro_ext39', label: 'PCC Neuro Ext39', functions: ['MyastheniaGravisExt', 'LambertEatonMyasthenicExt', 'CongenitalMyasthenicExt', 'BotulismExt2', 'TetanusExt2', 'NeurolepticMalignantExt', 'MalignantHyperthermiaExt', 'SerotoninSyndromeExt', 'AnticholinergicToxicityExt', 'CholinergicCrisisExt'] });
});
router.post('/call/MyastheniaGravisExt', authenticate, (req, res) => {
  res.json(MyastheniaGravisExt(req.body));
});

router.post('/call/LambertEatonMyasthenicExt', authenticate, (req, res) => {
  res.json(LambertEatonMyasthenicExt(req.body));
});

router.post('/call/CongenitalMyasthenicExt', authenticate, (req, res) => {
  res.json(CongenitalMyasthenicExt(req.body));
});

router.post('/call/BotulismExt2', authenticate, (req, res) => {
  res.json(BotulismExt2(req.body));
});

router.post('/call/TetanusExt2', authenticate, (req, res) => {
  res.json(TetanusExt2(req.body));
});

router.post('/call/NeurolepticMalignantExt', authenticate, (req, res) => {
  res.json(NeurolepticMalignantExt(req.body));
});

router.post('/call/MalignantHyperthermiaExt', authenticate, (req, res) => {
  res.json(MalignantHyperthermiaExt(req.body));
});

router.post('/call/SerotoninSyndromeExt', authenticate, (req, res) => {
  res.json(SerotoninSyndromeExt(req.body));
});

router.post('/call/AnticholinergicToxicityExt', authenticate, (req, res) => {
  res.json(AnticholinergicToxicityExt(req.body));
});

router.post('/call/CholinergicCrisisExt', authenticate, (req, res) => {
  res.json(CholinergicCrisisExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.138.0', module: 'pcc_neuro_ext39', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
