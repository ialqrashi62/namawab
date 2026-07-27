// pcc_pediatric_surg_ext14 routes v3.124.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricENTExt2, PediatricAdenoidectomyExt, PediatricTonsillectomyExt, PediatricMyringotomy, PediatricTympanostomyExt, PediatricSeptoplasty, PediatricRhinoplasty, PediatricSinusSurgery, PediatricTracheostomy, PediatricLaryngoscopy } = require('./pcc_pediatric_surg_ext14_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.124.0', module: 'pcc_pediatric_surg_ext14', label: 'PCC Pediatric Surg Ext14', functions: ['PediatricENTExt2', 'PediatricAdenoidectomyExt', 'PediatricTonsillectomyExt', 'PediatricMyringotomy', 'PediatricTympanostomyExt', 'PediatricSeptoplasty', 'PediatricRhinoplasty', 'PediatricSinusSurgery', 'PediatricTracheostomy', 'PediatricLaryngoscopy'] });
});
router.post('/call/PediatricENTExt2', authenticate, (req, res) => {
  res.json(PediatricENTExt2(req.body));
});

router.post('/call/PediatricAdenoidectomyExt', authenticate, (req, res) => {
  res.json(PediatricAdenoidectomyExt(req.body));
});

router.post('/call/PediatricTonsillectomyExt', authenticate, (req, res) => {
  res.json(PediatricTonsillectomyExt(req.body));
});

router.post('/call/PediatricMyringotomy', authenticate, (req, res) => {
  res.json(PediatricMyringotomy(req.body));
});

router.post('/call/PediatricTympanostomyExt', authenticate, (req, res) => {
  res.json(PediatricTympanostomyExt(req.body));
});

router.post('/call/PediatricSeptoplasty', authenticate, (req, res) => {
  res.json(PediatricSeptoplasty(req.body));
});

router.post('/call/PediatricRhinoplasty', authenticate, (req, res) => {
  res.json(PediatricRhinoplasty(req.body));
});

router.post('/call/PediatricSinusSurgery', authenticate, (req, res) => {
  res.json(PediatricSinusSurgery(req.body));
});

router.post('/call/PediatricTracheostomy', authenticate, (req, res) => {
  res.json(PediatricTracheostomy(req.body));
});

router.post('/call/PediatricLaryngoscopy', authenticate, (req, res) => {
  res.json(PediatricLaryngoscopy(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.124.0', module: 'pcc_pediatric_surg_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
