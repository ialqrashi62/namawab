// pcc_neuro_ext47 routes v3.146.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { VertebrobasilarInsufficiencyExt, BasilarArteryThrombosisExt, PosteriorFossaStrokeExt, CerebellarStrokeExt, LateralMedullarySyndromeExt, MedialMedullarySyndromeExt, LateralPonsSyndromeExt, LockedInSyndromeExt, TopOfBasilarSyndromeExt, SubclavianStealSyndromeExt } = require('./pcc_neuro_ext47_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.146.0', module: 'pcc_neuro_ext47', label: 'PCC Neuro Ext47', functions: ['VertebrobasilarInsufficiencyExt', 'BasilarArteryThrombosisExt', 'PosteriorFossaStrokeExt', 'CerebellarStrokeExt', 'LateralMedullarySyndromeExt', 'MedialMedullarySyndromeExt', 'LateralPonsSyndromeExt', 'LockedInSyndromeExt', 'TopOfBasilarSyndromeExt', 'SubclavianStealSyndromeExt'] });
});
router.post('/call/VertebrobasilarInsufficiencyExt', authenticate, (req, res) => {
  res.json(VertebrobasilarInsufficiencyExt(req.body));
});

router.post('/call/BasilarArteryThrombosisExt', authenticate, (req, res) => {
  res.json(BasilarArteryThrombosisExt(req.body));
});

router.post('/call/PosteriorFossaStrokeExt', authenticate, (req, res) => {
  res.json(PosteriorFossaStrokeExt(req.body));
});

router.post('/call/CerebellarStrokeExt', authenticate, (req, res) => {
  res.json(CerebellarStrokeExt(req.body));
});

router.post('/call/LateralMedullarySyndromeExt', authenticate, (req, res) => {
  res.json(LateralMedullarySyndromeExt(req.body));
});

router.post('/call/MedialMedullarySyndromeExt', authenticate, (req, res) => {
  res.json(MedialMedullarySyndromeExt(req.body));
});

router.post('/call/LateralPonsSyndromeExt', authenticate, (req, res) => {
  res.json(LateralPonsSyndromeExt(req.body));
});

router.post('/call/LockedInSyndromeExt', authenticate, (req, res) => {
  res.json(LockedInSyndromeExt(req.body));
});

router.post('/call/TopOfBasilarSyndromeExt', authenticate, (req, res) => {
  res.json(TopOfBasilarSyndromeExt(req.body));
});

router.post('/call/SubclavianStealSyndromeExt', authenticate, (req, res) => {
  res.json(SubclavianStealSyndromeExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.146.0', module: 'pcc_neuro_ext47', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
