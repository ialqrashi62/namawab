// P3-DZ pcc_neuro_ophthalmology_routes v3.90.0
// P3-DZ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_neuro_ophthalmology_engine.js');
const VER = '3.90.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ophthalmology', label: 'PCC Neuro Ophthalmology', functions: Object.keys(Engine) });
});
router.post('/call/PapilledemaEvaluation', (req, res) => { const r = Engine.PapilledemaEvaluation(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ophthalmology', function: 'PapilledemaEvaluation', plan: r.plan }); });
router.post('/call/OpticNeuritisWorkup', (req, res) => { const r = Engine.OpticNeuritisWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ophthalmology', function: 'OpticNeuritisWorkup', plan: r.plan }); });
router.post('/call/AnteriorIschemicOpticNeuropathy', (req, res) => { const r = Engine.AnteriorIschemicOpticNeuropathy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ophthalmology', function: 'AnteriorIschemicOpticNeuropathy', plan: r.plan }); });
router.post('/call/HomonymousHemianopiaLocalization', (req, res) => { const r = Engine.HomonymousHemianopiaLocalization(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ophthalmology', function: 'HomonymousHemianopiaLocalization', plan: r.plan }); });
router.post('/call/CranialNervePalsy', (req, res) => { const r = Engine.CranialNervePalsy(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ophthalmology', function: 'CranialNervePalsy', plan: r.plan }); });
router.post('/call/PupilAssessmentNeuro', (req, res) => { const r = Engine.PupilAssessmentNeuro(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ophthalmology', function: 'PupilAssessmentNeuro', plan: r.plan }); });
router.post('/call/VisualFieldDefectInterpretation', (req, res) => { const r = Engine.VisualFieldDefectInterpretation(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ophthalmology', function: 'VisualFieldDefectInterpretation', plan: r.plan }); });
router.post('/call/OcularMotorAssessment', (req, res) => { const r = Engine.OcularMotorAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ophthalmology', function: 'OcularMotorAssessment', plan: r.plan }); });
router.post('/call/NystagmusLocalization', (req, res) => { const r = Engine.NystagmusLocalization(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ophthalmology', function: 'NystagmusLocalization', plan: r.plan }); });
router.post('/call/TransientMonocularVisionLoss', (req, res) => { const r = Engine.TransientMonocularVisionLoss(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ophthalmology', function: 'TransientMonocularVisionLoss', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ophthalmology', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
