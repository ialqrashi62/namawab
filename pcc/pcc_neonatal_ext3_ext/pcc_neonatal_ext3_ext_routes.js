// P3-EB pcc_neonatal_ext3_ext_routes v3.92.0
// P3-EB: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_neonatal_ext3_ext_engine.js');
const VER = '3.92.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', label: 'PCC Neonatal Ext3 Ext', functions: Object.keys(Engine) });
});
router.post('/call/NICUDischargeReadiness', (req, res) => { const r = Engine.NICUDischargeReadiness(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'NICUDischargeReadiness', plan: r.plan }); });
router.post('/call/NeonatalPainAssessment', (req, res) => { const r = Engine.NeonatalPainAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'NeonatalPainAssessment', plan: r.plan }); });
router.post('/call/FamilyCenteredCare', (req, res) => { const r = Engine.FamilyCenteredCare(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'FamilyCenteredCare', plan: r.plan }); });
router.post('/call/NICUQualityImprovement', (req, res) => { const r = Engine.NICUQualityImprovement(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'NICUQualityImprovement', plan: r.plan }); });
router.post('/call/NeonatalThermoregulation', (req, res) => { const r = Engine.NeonatalThermoregulation(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'NeonatalThermoregulation', plan: r.plan }); });
router.post('/call/KangarooCareProtocol', (req, res) => { const r = Engine.KangarooCareProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'KangarooCareProtocol', plan: r.plan }); });
router.post('/call/NeonatalSkinCare', (req, res) => { const r = Engine.NeonatalSkinCare(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'NeonatalSkinCare', plan: r.plan }); });
router.post('/call/NICUEquipmentSafety', (req, res) => { const r = Engine.NICUEquipmentSafety(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'NICUEquipmentSafety', plan: r.plan }); });
router.post('/call/NeonatalNeurodevelopment', (req, res) => { const r = Engine.NeonatalNeurodevelopment(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'NeonatalNeurodevelopment', plan: r.plan }); });
router.post('/call/NICULongTermFollowUp', (req, res) => { const r = Engine.NICULongTermFollowUp(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: 'NICULongTermFollowUp', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_neonatal_ext3_ext', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
