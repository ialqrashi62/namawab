// pcc_pediatric_neuro_ext39 routes v3.149.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricMetabolicDisorderExt3, PediatricMitochondrialDiseaseExt, PediatricLysosomalStorageExt, PediatricPeroxisomalDisorderExt, PediatricAminoAcidDisorderExt, PediatricOrganicAcidemiaExt, PediatricUreaCycleDisorderExt, PediatricFattyAcidOxidationExt, PediatricGlycogenStorageExt, PediatricPurineDisorderExt } = require('./pcc_pediatric_neuro_ext39_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.149.0', module: 'pcc_pediatric_neuro_ext39', label: 'PCC Pediatric Neuro Ext39', functions: ['PediatricMetabolicDisorderExt3', 'PediatricMitochondrialDiseaseExt', 'PediatricLysosomalStorageExt', 'PediatricPeroxisomalDisorderExt', 'PediatricAminoAcidDisorderExt', 'PediatricOrganicAcidemiaExt', 'PediatricUreaCycleDisorderExt', 'PediatricFattyAcidOxidationExt', 'PediatricGlycogenStorageExt', 'PediatricPurineDisorderExt'] });
});
router.post('/call/PediatricMetabolicDisorderExt3', authenticate, (req, res) => {
  res.json(PediatricMetabolicDisorderExt3(req.body));
});

router.post('/call/PediatricMitochondrialDiseaseExt', authenticate, (req, res) => {
  res.json(PediatricMitochondrialDiseaseExt(req.body));
});

router.post('/call/PediatricLysosomalStorageExt', authenticate, (req, res) => {
  res.json(PediatricLysosomalStorageExt(req.body));
});

router.post('/call/PediatricPeroxisomalDisorderExt', authenticate, (req, res) => {
  res.json(PediatricPeroxisomalDisorderExt(req.body));
});

router.post('/call/PediatricAminoAcidDisorderExt', authenticate, (req, res) => {
  res.json(PediatricAminoAcidDisorderExt(req.body));
});

router.post('/call/PediatricOrganicAcidemiaExt', authenticate, (req, res) => {
  res.json(PediatricOrganicAcidemiaExt(req.body));
});

router.post('/call/PediatricUreaCycleDisorderExt', authenticate, (req, res) => {
  res.json(PediatricUreaCycleDisorderExt(req.body));
});

router.post('/call/PediatricFattyAcidOxidationExt', authenticate, (req, res) => {
  res.json(PediatricFattyAcidOxidationExt(req.body));
});

router.post('/call/PediatricGlycogenStorageExt', authenticate, (req, res) => {
  res.json(PediatricGlycogenStorageExt(req.body));
});

router.post('/call/PediatricPurineDisorderExt', authenticate, (req, res) => {
  res.json(PediatricPurineDisorderExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.149.0', module: 'pcc_pediatric_neuro_ext39', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
