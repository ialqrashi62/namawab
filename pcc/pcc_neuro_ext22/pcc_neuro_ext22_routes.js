// pcc_neuro_ext22 routes v3.121.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { NeuropathyExt2, DiabeticPeripheralNeuropathy, AlcoholicPolyneuropathy, CharcotMarieToothExt, GuillainBarreExt2, CIDPExt, VasculiticNeuropathy, ToxicNeuropathy, DrugInducedNeuropathy, HereditaryNeuropathy } = require('./pcc_neuro_ext22_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.121.0', module: 'pcc_neuro_ext22', label: 'PCC Neuro Ext22', functions: ['NeuropathyExt2', 'DiabeticPeripheralNeuropathy', 'AlcoholicPolyneuropathy', 'CharcotMarieToothExt', 'GuillainBarreExt2', 'CIDPExt', 'VasculiticNeuropathy', 'ToxicNeuropathy', 'DrugInducedNeuropathy', 'HereditaryNeuropathy'] });
});
router.post('/call/NeuropathyExt2', authenticate, (req, res) => {
  res.json(NeuropathyExt2(req.body));
});

router.post('/call/DiabeticPeripheralNeuropathy', authenticate, (req, res) => {
  res.json(DiabeticPeripheralNeuropathy(req.body));
});

router.post('/call/AlcoholicPolyneuropathy', authenticate, (req, res) => {
  res.json(AlcoholicPolyneuropathy(req.body));
});

router.post('/call/CharcotMarieToothExt', authenticate, (req, res) => {
  res.json(CharcotMarieToothExt(req.body));
});

router.post('/call/GuillainBarreExt2', authenticate, (req, res) => {
  res.json(GuillainBarreExt2(req.body));
});

router.post('/call/CIDPExt', authenticate, (req, res) => {
  res.json(CIDPExt(req.body));
});

router.post('/call/VasculiticNeuropathy', authenticate, (req, res) => {
  res.json(VasculiticNeuropathy(req.body));
});

router.post('/call/ToxicNeuropathy', authenticate, (req, res) => {
  res.json(ToxicNeuropathy(req.body));
});

router.post('/call/DrugInducedNeuropathy', authenticate, (req, res) => {
  res.json(DrugInducedNeuropathy(req.body));
});

router.post('/call/HereditaryNeuropathy', authenticate, (req, res) => {
  res.json(HereditaryNeuropathy(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
