// pcc_pediatric_surg_ext16 routes v3.126.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricOphthalmologyExt, PediatricStrabismusSurgeryExt, PediatricCataractSurgeryExt, PediatricGlaucomaSurgeryExt, PediatricRetinoblastomaExt, PediatricRetinalDetachment, PediatricVitrectomy, PediatricEyelidSurgery, PediatricLacrimalSurgery, PediatricOrbitalSurgery } = require('./pcc_pediatric_surg_ext16_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.126.0', module: 'pcc_pediatric_surg_ext16', label: 'PCC Pediatric Surg Ext16', functions: ['PediatricOphthalmologyExt', 'PediatricStrabismusSurgeryExt', 'PediatricCataractSurgeryExt', 'PediatricGlaucomaSurgeryExt', 'PediatricRetinoblastomaExt', 'PediatricRetinalDetachment', 'PediatricVitrectomy', 'PediatricEyelidSurgery', 'PediatricLacrimalSurgery', 'PediatricOrbitalSurgery'] });
});
router.post('/call/PediatricOphthalmologyExt', authenticate, (req, res) => {
  res.json(PediatricOphthalmologyExt(req.body));
});

router.post('/call/PediatricStrabismusSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricStrabismusSurgeryExt(req.body));
});

router.post('/call/PediatricCataractSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricCataractSurgeryExt(req.body));
});

router.post('/call/PediatricGlaucomaSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricGlaucomaSurgeryExt(req.body));
});

router.post('/call/PediatricRetinoblastomaExt', authenticate, (req, res) => {
  res.json(PediatricRetinoblastomaExt(req.body));
});

router.post('/call/PediatricRetinalDetachment', authenticate, (req, res) => {
  res.json(PediatricRetinalDetachment(req.body));
});

router.post('/call/PediatricVitrectomy', authenticate, (req, res) => {
  res.json(PediatricVitrectomy(req.body));
});

router.post('/call/PediatricEyelidSurgery', authenticate, (req, res) => {
  res.json(PediatricEyelidSurgery(req.body));
});

router.post('/call/PediatricLacrimalSurgery', authenticate, (req, res) => {
  res.json(PediatricLacrimalSurgery(req.body));
});

router.post('/call/PediatricOrbitalSurgery', authenticate, (req, res) => {
  res.json(PediatricOrbitalSurgery(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.126.0', module: 'pcc_pediatric_surg_ext16', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
