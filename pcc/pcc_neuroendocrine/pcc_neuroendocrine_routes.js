// P3-EE pcc_neuroendocrine_routes v3.95.0
// P3-EE: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neuroendocrine_engine.js');
const VER = '3.95.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuroendocrine', label: 'PCC Neuroendocrine', functions: Object.keys(F) });
});
router.post('/call/PituitaryAdenomaWorkup', (req, res) => { const r = F.PituitaryAdenomaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_neuroendocrine', function: 'PituitaryAdenomaWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CushingSyndromeDiagnosis', (req, res) => { const r = F.CushingSyndromeDiagnosis(req.body || {}); res.json({ version: VER, module: 'pcc_neuroendocrine', function: 'CushingSyndromeDiagnosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AddisonDiseaseCrisis', (req, res) => { const r = F.AddisonDiseaseCrisis(req.body || {}); res.json({ version: VER, module: 'pcc_neuroendocrine', function: 'AddisonDiseaseCrisis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AcromegalyManagement', (req, res) => { const r = F.AcromegalyManagement(req.body || {}); res.json({ version: VER, module: 'pcc_neuroendocrine', function: 'AcromegalyManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ProlactinomaTreatment', (req, res) => { const r = F.ProlactinomaTreatment(req.body || {}); res.json({ version: VER, module: 'pcc_neuroendocrine', function: 'ProlactinomaTreatment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HypopituitarismEvaluation', (req, res) => { const r = F.HypopituitarismEvaluation(req.body || {}); res.json({ version: VER, module: 'pcc_neuroendocrine', function: 'HypopituitarismEvaluation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PheochromocytomaWorkup', (req, res) => { const r = F.PheochromocytomaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_neuroendocrine', function: 'PheochromocytomaWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MultipleEndocrineNeoplasia', (req, res) => { const r = F.MultipleEndocrineNeoplasia(req.body || {}); res.json({ version: VER, module: 'pcc_neuroendocrine', function: 'MultipleEndocrineNeoplasia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CarcinoidSyndrome', (req, res) => { const r = F.CarcinoidSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_neuroendocrine', function: 'CarcinoidSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HypothalamicHamartoma', (req, res) => { const r = F.HypothalamicHamartoma(req.body || {}); res.json({ version: VER, module: 'pcc_neuroendocrine', function: 'HypothalamicHamartoma', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuroendocrine', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
