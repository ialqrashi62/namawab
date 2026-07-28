// pcc_neuro_ext45 routes v3.144.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { CranialNerveIPalsyExt, CranialNerveIIPalsyExt, CranialNerveIIIPalsyExt, CranialNerveIVPalsyExt, CranialNerveVPalsyExt, CranialNerveVIPalsyExt, CranialNerveVIIPalsyExt, CranialNerveVIIIPalsyExt, CranialNerveIXPalsyExt, CranialNerveXPalsyExt } = require('./pcc_neuro_ext45_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.144.0', module: 'pcc_neuro_ext45', label: 'PCC Neuro Ext45', functions: ['CranialNerveIPalsyExt', 'CranialNerveIIPalsyExt', 'CranialNerveIIIPalsyExt', 'CranialNerveIVPalsyExt', 'CranialNerveVPalsyExt', 'CranialNerveVIPalsyExt', 'CranialNerveVIIPalsyExt', 'CranialNerveVIIIPalsyExt', 'CranialNerveIXPalsyExt', 'CranialNerveXPalsyExt'] });
});
router.post('/call/CranialNerveIPalsyExt', authenticate, (req, res) => {
  res.json(CranialNerveIPalsyExt(req.body));
});

router.post('/call/CranialNerveIIPalsyExt', authenticate, (req, res) => {
  res.json(CranialNerveIIPalsyExt(req.body));
});

router.post('/call/CranialNerveIIIPalsyExt', authenticate, (req, res) => {
  res.json(CranialNerveIIIPalsyExt(req.body));
});

router.post('/call/CranialNerveIVPalsyExt', authenticate, (req, res) => {
  res.json(CranialNerveIVPalsyExt(req.body));
});

router.post('/call/CranialNerveVPalsyExt', authenticate, (req, res) => {
  res.json(CranialNerveVPalsyExt(req.body));
});

router.post('/call/CranialNerveVIPalsyExt', authenticate, (req, res) => {
  res.json(CranialNerveVIPalsyExt(req.body));
});

router.post('/call/CranialNerveVIIPalsyExt', authenticate, (req, res) => {
  res.json(CranialNerveVIIPalsyExt(req.body));
});

router.post('/call/CranialNerveVIIIPalsyExt', authenticate, (req, res) => {
  res.json(CranialNerveVIIIPalsyExt(req.body));
});

router.post('/call/CranialNerveIXPalsyExt', authenticate, (req, res) => {
  res.json(CranialNerveIXPalsyExt(req.body));
});

router.post('/call/CranialNerveXPalsyExt', authenticate, (req, res) => {
  res.json(CranialNerveXPalsyExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.144.0', module: 'pcc_neuro_ext45', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
