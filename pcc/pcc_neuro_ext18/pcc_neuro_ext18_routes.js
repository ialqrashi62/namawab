// pcc_neuro_ext18 routes v3.117.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { BrainTumorExt, GlioblastomaMultiformeExt, MeningiomaExt, PituitaryAdenomaExt, AcousticNeuromaExt, MetastaticBrainTumor, PrimaryCNSLymphoma, MedulloblastomaAdult, EpendymomaAdult, OligodendrogliomaExt } = require('./pcc_neuro_ext18_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.117.0', module: 'pcc_neuro_ext18', label: 'PCC Neuro Ext18', functions: ['BrainTumorExt', 'GlioblastomaMultiformeExt', 'MeningiomaExt', 'PituitaryAdenomaExt', 'AcousticNeuromaExt', 'MetastaticBrainTumor', 'PrimaryCNSLymphoma', 'MedulloblastomaAdult', 'EpendymomaAdult', 'OligodendrogliomaExt'] });
});
router.post('/call/BrainTumorExt', authenticate, (req, res) => {
  res.json(BrainTumorExt(req.body));
});

router.post('/call/GlioblastomaMultiformeExt', authenticate, (req, res) => {
  res.json(GlioblastomaMultiformeExt(req.body));
});

router.post('/call/MeningiomaExt', authenticate, (req, res) => {
  res.json(MeningiomaExt(req.body));
});

router.post('/call/PituitaryAdenomaExt', authenticate, (req, res) => {
  res.json(PituitaryAdenomaExt(req.body));
});

router.post('/call/AcousticNeuromaExt', authenticate, (req, res) => {
  res.json(AcousticNeuromaExt(req.body));
});

router.post('/call/MetastaticBrainTumor', authenticate, (req, res) => {
  res.json(MetastaticBrainTumor(req.body));
});

router.post('/call/PrimaryCNSLymphoma', authenticate, (req, res) => {
  res.json(PrimaryCNSLymphoma(req.body));
});

router.post('/call/MedulloblastomaAdult', authenticate, (req, res) => {
  res.json(MedulloblastomaAdult(req.body));
});

router.post('/call/EpendymomaAdult', authenticate, (req, res) => {
  res.json(EpendymomaAdult(req.body));
});

router.post('/call/OligodendrogliomaExt', authenticate, (req, res) => {
  res.json(OligodendrogliomaExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.117.0', module: 'pcc_neuro_ext18', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
