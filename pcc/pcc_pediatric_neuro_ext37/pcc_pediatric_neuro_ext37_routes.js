// pcc_pediatric_neuro_ext37 routes v3.147.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricHeadacheDisorderExt, PediatricMigraineWithAuraExt, PediatricMigraineWithoutAuraExt, PediatricHemiplegicMigraineExt, PediatricBasilarMigraineExt, PediatricConfusionalMigraineExt, PediatricOphthalmoplegicMigraineExt, PediatricVestibularMigraineExt, PediatricAbdominalMigraineExt, PediatricCyclicVomitingExt } = require('./pcc_pediatric_neuro_ext37_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.147.0', module: 'pcc_pediatric_neuro_ext37', label: 'PCC Pediatric Neuro Ext37', functions: ['PediatricHeadacheDisorderExt', 'PediatricMigraineWithAuraExt', 'PediatricMigraineWithoutAuraExt', 'PediatricHemiplegicMigraineExt', 'PediatricBasilarMigraineExt', 'PediatricConfusionalMigraineExt', 'PediatricOphthalmoplegicMigraineExt', 'PediatricVestibularMigraineExt', 'PediatricAbdominalMigraineExt', 'PediatricCyclicVomitingExt'] });
});
router.post('/call/PediatricHeadacheDisorderExt', authenticate, (req, res) => {
  res.json(PediatricHeadacheDisorderExt(req.body));
});

router.post('/call/PediatricMigraineWithAuraExt', authenticate, (req, res) => {
  res.json(PediatricMigraineWithAuraExt(req.body));
});

router.post('/call/PediatricMigraineWithoutAuraExt', authenticate, (req, res) => {
  res.json(PediatricMigraineWithoutAuraExt(req.body));
});

router.post('/call/PediatricHemiplegicMigraineExt', authenticate, (req, res) => {
  res.json(PediatricHemiplegicMigraineExt(req.body));
});

router.post('/call/PediatricBasilarMigraineExt', authenticate, (req, res) => {
  res.json(PediatricBasilarMigraineExt(req.body));
});

router.post('/call/PediatricConfusionalMigraineExt', authenticate, (req, res) => {
  res.json(PediatricConfusionalMigraineExt(req.body));
});

router.post('/call/PediatricOphthalmoplegicMigraineExt', authenticate, (req, res) => {
  res.json(PediatricOphthalmoplegicMigraineExt(req.body));
});

router.post('/call/PediatricVestibularMigraineExt', authenticate, (req, res) => {
  res.json(PediatricVestibularMigraineExt(req.body));
});

router.post('/call/PediatricAbdominalMigraineExt', authenticate, (req, res) => {
  res.json(PediatricAbdominalMigraineExt(req.body));
});

router.post('/call/PediatricCyclicVomitingExt', authenticate, (req, res) => {
  res.json(PediatricCyclicVomitingExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
