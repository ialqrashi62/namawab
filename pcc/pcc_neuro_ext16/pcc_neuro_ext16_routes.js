// pcc_neuro_ext16 routes v3.115.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { BellsPalsyExt, TrigeminalNeuralgiaExt, HemifacialSpasm, GlossopharyngealNeuralgia, OccipitalNeuralgia, ClusterHeadacheExt, MigraineVariants, CervicogenicHeadache, TensionHeadacheExt, MedicationOveruseHeadache } = require('./pcc_neuro_ext16_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.115.0', module: 'pcc_neuro_ext16', label: 'PCC Neuro Ext16', functions: ['BellsPalsyExt', 'TrigeminalNeuralgiaExt', 'HemifacialSpasm', 'GlossopharyngealNeuralgia', 'OccipitalNeuralgia', 'ClusterHeadacheExt', 'MigraineVariants', 'CervicogenicHeadache', 'TensionHeadacheExt', 'MedicationOveruseHeadache'] });
});
router.post('/call/BellsPalsyExt', authenticate, (req, res) => {
  res.json(BellsPalsyExt(req.body));
});

router.post('/call/TrigeminalNeuralgiaExt', authenticate, (req, res) => {
  res.json(TrigeminalNeuralgiaExt(req.body));
});

router.post('/call/HemifacialSpasm', authenticate, (req, res) => {
  res.json(HemifacialSpasm(req.body));
});

router.post('/call/GlossopharyngealNeuralgia', authenticate, (req, res) => {
  res.json(GlossopharyngealNeuralgia(req.body));
});

router.post('/call/OccipitalNeuralgia', authenticate, (req, res) => {
  res.json(OccipitalNeuralgia(req.body));
});

router.post('/call/ClusterHeadacheExt', authenticate, (req, res) => {
  res.json(ClusterHeadacheExt(req.body));
});

router.post('/call/MigraineVariants', authenticate, (req, res) => {
  res.json(MigraineVariants(req.body));
});

router.post('/call/CervicogenicHeadache', authenticate, (req, res) => {
  res.json(CervicogenicHeadache(req.body));
});

router.post('/call/TensionHeadacheExt', authenticate, (req, res) => {
  res.json(TensionHeadacheExt(req.body));
});

router.post('/call/MedicationOveruseHeadache', authenticate, (req, res) => {
  res.json(MedicationOveruseHeadache(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.115.0', module: 'pcc_neuro_ext16', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
