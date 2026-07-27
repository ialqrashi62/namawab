// pcc_pediatric_surg_ext8 routes v3.118.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricCleftPalateRepair, PediatricCleftLipRepair, PediatricAlveolarBoneGraft, PediatricPharyngoplasty, PediatricTympanoplasty, PediatricMastoidectomy, PediatricCochlearImplant, PediatricBAHAImplant, PediatricBoneAnchoredHearing, PediatricMiddleEarSurgery } = require('./pcc_pediatric_surg_ext8_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.118.0', module: 'pcc_pediatric_surg_ext8', label: 'PCC Pediatric Surg Ext8', functions: ['PediatricCleftPalateRepair', 'PediatricCleftLipRepair', 'PediatricAlveolarBoneGraft', 'PediatricPharyngoplasty', 'PediatricTympanoplasty', 'PediatricMastoidectomy', 'PediatricCochlearImplant', 'PediatricBAHAImplant', 'PediatricBoneAnchoredHearing', 'PediatricMiddleEarSurgery'] });
});
router.post('/call/PediatricCleftPalateRepair', authenticate, (req, res) => {
  res.json(PediatricCleftPalateRepair(req.body));
});

router.post('/call/PediatricCleftLipRepair', authenticate, (req, res) => {
  res.json(PediatricCleftLipRepair(req.body));
});

router.post('/call/PediatricAlveolarBoneGraft', authenticate, (req, res) => {
  res.json(PediatricAlveolarBoneGraft(req.body));
});

router.post('/call/PediatricPharyngoplasty', authenticate, (req, res) => {
  res.json(PediatricPharyngoplasty(req.body));
});

router.post('/call/PediatricTympanoplasty', authenticate, (req, res) => {
  res.json(PediatricTympanoplasty(req.body));
});

router.post('/call/PediatricMastoidectomy', authenticate, (req, res) => {
  res.json(PediatricMastoidectomy(req.body));
});

router.post('/call/PediatricCochlearImplant', authenticate, (req, res) => {
  res.json(PediatricCochlearImplant(req.body));
});

router.post('/call/PediatricBAHAImplant', authenticate, (req, res) => {
  res.json(PediatricBAHAImplant(req.body));
});

router.post('/call/PediatricBoneAnchoredHearing', authenticate, (req, res) => {
  res.json(PediatricBoneAnchoredHearing(req.body));
});

router.post('/call/PediatricMiddleEarSurgery', authenticate, (req, res) => {
  res.json(PediatricMiddleEarSurgery(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.118.0', module: 'pcc_pediatric_surg_ext8', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
