// P3-EB pcc_neonatal_ext3_ext_routes v3.92.0
// P3-EB: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neonatal_ext3_ext_engine.js');
const VER = '3.92.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', label: 'PCC Neonatal Ext3 Ext', functions: Object.keys(F) });
});
router.post('/call/NICUDischargeReadiness', (req, res) => { const r = F.NICUDischargeReadiness(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'NICUDischargeReadiness', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeonatalPainAssessment', (req, res) => { const r = F.NeonatalPainAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'NeonatalPainAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FamilyCenteredCare', (req, res) => { const r = F.FamilyCenteredCare(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'FamilyCenteredCare', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NICUQualityImprovement', (req, res) => { const r = F.NICUQualityImprovement(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'NICUQualityImprovement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeonatalThermoregulation', (req, res) => { const r = F.NeonatalThermoregulation(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'NeonatalThermoregulation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/KangarooCareProtocol', (req, res) => { const r = F.KangarooCareProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'KangarooCareProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeonatalSkinCare', (req, res) => { const r = F.NeonatalSkinCare(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'NeonatalSkinCare', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NICUEquipmentSafety', (req, res) => { const r = F.NICUEquipmentSafety(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'NICUEquipmentSafety', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeonatalNeurodevelopment', (req, res) => { const r = F.NeonatalNeurodevelopment(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'NeonatalNeurodevelopment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NICULongTermFollowUp', (req, res) => { const r = F.NICULongTermFollowUp(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'NICULongTermFollowUp', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
