// pcc_pediatric_neuro_ext45 routes v3.155.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricNutritionalDeficiencyExt, PediatricVitaminB12DeficiencyExt, PediatricFolateDeficiencyExt, PediatricThiamineDeficiencyExt, PediatricNiacinDeficiencyExt, PediatricPyridoxineDeficiencyExt, PediatricVitaminDDeficiencyExt, PediatricVitaminKDeficiencyExt, PediatricIronDeficiencyExt, PediatricIodineDeficiencyExt } = require('./pcc_pediatric_neuro_ext45_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.155.0', module: 'pcc_pediatric_neuro_ext45', label: 'PCC Pediatric Neuro Ext45', functions: ['PediatricNutritionalDeficiencyExt', 'PediatricVitaminB12DeficiencyExt', 'PediatricFolateDeficiencyExt', 'PediatricThiamineDeficiencyExt', 'PediatricNiacinDeficiencyExt', 'PediatricPyridoxineDeficiencyExt', 'PediatricVitaminDDeficiencyExt', 'PediatricVitaminKDeficiencyExt', 'PediatricIronDeficiencyExt', 'PediatricIodineDeficiencyExt'] });
});
router.post('/call/PediatricNutritionalDeficiencyExt', authenticate, (req, res) => {
  res.json(PediatricNutritionalDeficiencyExt(req.body));
});

router.post('/call/PediatricVitaminB12DeficiencyExt', authenticate, (req, res) => {
  res.json(PediatricVitaminB12DeficiencyExt(req.body));
});

router.post('/call/PediatricFolateDeficiencyExt', authenticate, (req, res) => {
  res.json(PediatricFolateDeficiencyExt(req.body));
});

router.post('/call/PediatricThiamineDeficiencyExt', authenticate, (req, res) => {
  res.json(PediatricThiamineDeficiencyExt(req.body));
});

router.post('/call/PediatricNiacinDeficiencyExt', authenticate, (req, res) => {
  res.json(PediatricNiacinDeficiencyExt(req.body));
});

router.post('/call/PediatricPyridoxineDeficiencyExt', authenticate, (req, res) => {
  res.json(PediatricPyridoxineDeficiencyExt(req.body));
});

router.post('/call/PediatricVitaminDDeficiencyExt', authenticate, (req, res) => {
  res.json(PediatricVitaminDDeficiencyExt(req.body));
});

router.post('/call/PediatricVitaminKDeficiencyExt', authenticate, (req, res) => {
  res.json(PediatricVitaminKDeficiencyExt(req.body));
});

router.post('/call/PediatricIronDeficiencyExt', authenticate, (req, res) => {
  res.json(PediatricIronDeficiencyExt(req.body));
});

router.post('/call/PediatricIodineDeficiencyExt', authenticate, (req, res) => {
  res.json(PediatricIodineDeficiencyExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.155.0', module: 'pcc_pediatric_neuro_ext45', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
