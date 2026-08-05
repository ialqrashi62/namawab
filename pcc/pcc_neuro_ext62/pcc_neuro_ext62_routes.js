// pcc_neuro_ext62 routes v3.161.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { IdiopathicIntracranialHypertensionExt2, PseudotumorCerebriSyndromeExt, EmptySellaSyndromeExt, CSFPressureDisorderExt, CSFLeakPositionalExt, CSFVenousFistulaTreatmentExt, CSFShuntObstructionExt, CSFShuntInfectionExt, CerebralVenousThrombosisTreatmentExt, ReversibleCerebralVasoconstrictionExt } = require('./pcc_neuro_ext62_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.161.0', module: 'pcc_neuro_ext62', label: 'PCC Neuro Ext62', functions: ['IdiopathicIntracranialHypertensionExt2', 'PseudotumorCerebriSyndromeExt', 'EmptySellaSyndromeExt', 'CSFPressureDisorderExt', 'CSFLeakPositionalExt', 'CSFVenousFistulaTreatmentExt', 'CSFShuntObstructionExt', 'CSFShuntInfectionExt', 'CerebralVenousThrombosisTreatmentExt', 'ReversibleCerebralVasoconstrictionExt'] });
});
router.post('/call/IdiopathicIntracranialHypertensionExt2', authenticate, (req, res) => {
  res.json(IdiopathicIntracranialHypertensionExt2(req.body));
});

router.post('/call/PseudotumorCerebriSyndromeExt', authenticate, (req, res) => {
  res.json(PseudotumorCerebriSyndromeExt(req.body));
});

router.post('/call/EmptySellaSyndromeExt', authenticate, (req, res) => {
  res.json(EmptySellaSyndromeExt(req.body));
});

router.post('/call/CSFPressureDisorderExt', authenticate, (req, res) => {
  res.json(CSFPressureDisorderExt(req.body));
});

router.post('/call/CSFLeakPositionalExt', authenticate, (req, res) => {
  res.json(CSFLeakPositionalExt(req.body));
});

router.post('/call/CSFVenousFistulaTreatmentExt', authenticate, (req, res) => {
  res.json(CSFVenousFistulaTreatmentExt(req.body));
});

router.post('/call/CSFShuntObstructionExt', authenticate, (req, res) => {
  res.json(CSFShuntObstructionExt(req.body));
});

router.post('/call/CSFShuntInfectionExt', authenticate, (req, res) => {
  res.json(CSFShuntInfectionExt(req.body));
});

router.post('/call/CerebralVenousThrombosisTreatmentExt', authenticate, (req, res) => {
  res.json(CerebralVenousThrombosisTreatmentExt(req.body));
});

router.post('/call/ReversibleCerebralVasoconstrictionExt', authenticate, (req, res) => {
  res.json(ReversibleCerebralVasoconstrictionExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
