// pcc_neuro_ext50 routes v3.149.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { MeningiomaExt, AnaplasticMeningiomaExt, HemangioblastomaExt, HemangiopericytomaExt, PrimaryCNSLymphomaExt, CNSLymphomaExt, GermCellTumorExt, PineoblastomaExt, PituitaryAdenomaExt, PituitaryApoplexyExt } = require('./pcc_neuro_ext50_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.149.0', module: 'pcc_neuro_ext50', label: 'PCC Neuro Ext50', functions: ['MeningiomaExt', 'AnaplasticMeningiomaExt', 'HemangioblastomaExt', 'HemangiopericytomaExt', 'PrimaryCNSLymphomaExt', 'CNSLymphomaExt', 'GermCellTumorExt', 'PineoblastomaExt', 'PituitaryAdenomaExt', 'PituitaryApoplexyExt'] });
});
router.post('/call/MeningiomaExt', authenticate, (req, res) => {
  res.json(MeningiomaExt(req.body));
});

router.post('/call/AnaplasticMeningiomaExt', authenticate, (req, res) => {
  res.json(AnaplasticMeningiomaExt(req.body));
});

router.post('/call/HemangioblastomaExt', authenticate, (req, res) => {
  res.json(HemangioblastomaExt(req.body));
});

router.post('/call/HemangiopericytomaExt', authenticate, (req, res) => {
  res.json(HemangiopericytomaExt(req.body));
});

router.post('/call/PrimaryCNSLymphomaExt', authenticate, (req, res) => {
  res.json(PrimaryCNSLymphomaExt(req.body));
});

router.post('/call/CNSLymphomaExt', authenticate, (req, res) => {
  res.json(CNSLymphomaExt(req.body));
});

router.post('/call/GermCellTumorExt', authenticate, (req, res) => {
  res.json(GermCellTumorExt(req.body));
});

router.post('/call/PineoblastomaExt', authenticate, (req, res) => {
  res.json(PineoblastomaExt(req.body));
});

router.post('/call/PituitaryAdenomaExt', authenticate, (req, res) => {
  res.json(PituitaryAdenomaExt(req.body));
});

router.post('/call/PituitaryApoplexyExt', authenticate, (req, res) => {
  res.json(PituitaryApoplexyExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.149.0', module: 'pcc_neuro_ext50', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
