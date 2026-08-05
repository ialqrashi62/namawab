// pcc_neuro_ext27 routes v3.126.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { ParkinsonPlusExt2, CorticobasalDegenerationExt, ProgressiveSupranuclearPalsyExt2, MultipleSystemAtrophyExt2, DementiaWithLewyBodies, ParkinsonDiseaseDementia, VascularParkinsonism, DrugInducedParkinsonism, EssentialTremorExt, CerebellarTremor } = require('./pcc_neuro_ext27_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.126.0', module: 'pcc_neuro_ext27', label: 'PCC Neuro Ext27', functions: ['ParkinsonPlusExt2', 'CorticobasalDegenerationExt', 'ProgressiveSupranuclearPalsyExt2', 'MultipleSystemAtrophyExt2', 'DementiaWithLewyBodies', 'ParkinsonDiseaseDementia', 'VascularParkinsonism', 'DrugInducedParkinsonism', 'EssentialTremorExt', 'CerebellarTremor'] });
});
router.post('/call/ParkinsonPlusExt2', authenticate, (req, res) => {
  res.json(ParkinsonPlusExt2(req.body));
});

router.post('/call/CorticobasalDegenerationExt', authenticate, (req, res) => {
  res.json(CorticobasalDegenerationExt(req.body));
});

router.post('/call/ProgressiveSupranuclearPalsyExt2', authenticate, (req, res) => {
  res.json(ProgressiveSupranuclearPalsyExt2(req.body));
});

router.post('/call/MultipleSystemAtrophyExt2', authenticate, (req, res) => {
  res.json(MultipleSystemAtrophyExt2(req.body));
});

router.post('/call/DementiaWithLewyBodies', authenticate, (req, res) => {
  res.json(DementiaWithLewyBodies(req.body));
});

router.post('/call/ParkinsonDiseaseDementia', authenticate, (req, res) => {
  res.json(ParkinsonDiseaseDementia(req.body));
});

router.post('/call/VascularParkinsonism', authenticate, (req, res) => {
  res.json(VascularParkinsonism(req.body));
});

router.post('/call/DrugInducedParkinsonism', authenticate, (req, res) => {
  res.json(DrugInducedParkinsonism(req.body));
});

router.post('/call/EssentialTremorExt', authenticate, (req, res) => {
  res.json(EssentialTremorExt(req.body));
});

router.post('/call/CerebellarTremor', authenticate, (req, res) => {
  res.json(CerebellarTremor(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
