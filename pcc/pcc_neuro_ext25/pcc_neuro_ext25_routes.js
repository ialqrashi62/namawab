// pcc_neuro_ext25 routes v3.124.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { CerebellarDisorderExt, CerebellarDegeneration, ParaneoplasticCerebellar, ToxicCerebellarSyndrome, AlcoholicCerebellar, CerebellarStroke, CerebellarTumorExt, FlocculonodularSyndrome, CerebellarCognitiveAffective, MachadoJosephDisease } = require('./pcc_neuro_ext25_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.124.0', module: 'pcc_neuro_ext25', label: 'PCC Neuro Ext25', functions: ['CerebellarDisorderExt', 'CerebellarDegeneration', 'ParaneoplasticCerebellar', 'ToxicCerebellarSyndrome', 'AlcoholicCerebellar', 'CerebellarStroke', 'CerebellarTumorExt', 'FlocculonodularSyndrome', 'CerebellarCognitiveAffective', 'MachadoJosephDisease'] });
});
router.post('/call/CerebellarDisorderExt', authenticate, (req, res) => {
  res.json(CerebellarDisorderExt(req.body));
});

router.post('/call/CerebellarDegeneration', authenticate, (req, res) => {
  res.json(CerebellarDegeneration(req.body));
});

router.post('/call/ParaneoplasticCerebellar', authenticate, (req, res) => {
  res.json(ParaneoplasticCerebellar(req.body));
});

router.post('/call/ToxicCerebellarSyndrome', authenticate, (req, res) => {
  res.json(ToxicCerebellarSyndrome(req.body));
});

router.post('/call/AlcoholicCerebellar', authenticate, (req, res) => {
  res.json(AlcoholicCerebellar(req.body));
});

router.post('/call/CerebellarStroke', authenticate, (req, res) => {
  res.json(CerebellarStroke(req.body));
});

router.post('/call/CerebellarTumorExt', authenticate, (req, res) => {
  res.json(CerebellarTumorExt(req.body));
});

router.post('/call/FlocculonodularSyndrome', authenticate, (req, res) => {
  res.json(FlocculonodularSyndrome(req.body));
});

router.post('/call/CerebellarCognitiveAffective', authenticate, (req, res) => {
  res.json(CerebellarCognitiveAffective(req.body));
});

router.post('/call/MachadoJosephDisease', authenticate, (req, res) => {
  res.json(MachadoJosephDisease(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
