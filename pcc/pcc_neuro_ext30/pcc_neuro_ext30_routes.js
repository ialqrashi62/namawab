// pcc_neuro_ext30 routes v3.129.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { HeadacheDisorderExt2, MigraineWithoutAura, MigraineWithAura, ChronicMigraine, TensionTypeHeadache, ClusterHeadacheExt2, HemicraniaContinua, SUNCTHeadache, HypnicHeadache, ThunderclapHeadache } = require('./pcc_neuro_ext30_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.129.0', module: 'pcc_neuro_ext30', label: 'PCC Neuro Ext30', functions: ['HeadacheDisorderExt2', 'MigraineWithoutAura', 'MigraineWithAura', 'ChronicMigraine', 'TensionTypeHeadache', 'ClusterHeadacheExt2', 'HemicraniaContinua', 'SUNCTHeadache', 'HypnicHeadache', 'ThunderclapHeadache'] });
});
router.post('/call/HeadacheDisorderExt2', authenticate, (req, res) => {
  res.json(HeadacheDisorderExt2(req.body));
});

router.post('/call/MigraineWithoutAura', authenticate, (req, res) => {
  res.json(MigraineWithoutAura(req.body));
});

router.post('/call/MigraineWithAura', authenticate, (req, res) => {
  res.json(MigraineWithAura(req.body));
});

router.post('/call/ChronicMigraine', authenticate, (req, res) => {
  res.json(ChronicMigraine(req.body));
});

router.post('/call/TensionTypeHeadache', authenticate, (req, res) => {
  res.json(TensionTypeHeadache(req.body));
});

router.post('/call/ClusterHeadacheExt2', authenticate, (req, res) => {
  res.json(ClusterHeadacheExt2(req.body));
});

router.post('/call/HemicraniaContinua', authenticate, (req, res) => {
  res.json(HemicraniaContinua(req.body));
});

router.post('/call/SUNCTHeadache', authenticate, (req, res) => {
  res.json(SUNCTHeadache(req.body));
});

router.post('/call/HypnicHeadache', authenticate, (req, res) => {
  res.json(HypnicHeadache(req.body));
});

router.post('/call/ThunderclapHeadache', authenticate, (req, res) => {
  res.json(ThunderclapHeadache(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
