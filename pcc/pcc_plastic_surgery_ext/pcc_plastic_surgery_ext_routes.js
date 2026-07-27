// P3-EB pcc_plastic_surgery_ext_routes v3.92.0
// P3-EB: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_plastic_surgery_ext_engine.js');
const VER = '3.92.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_plastic_surgery_ext', label: 'PCC Plastic Surgery Ext', functions: Object.keys(Engine) });
});
router.post('/call/BreastReconstructionSelection', (req, res) => { const r = Engine.BreastReconstructionSelection(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'BreastReconstructionSelection', plan: r.plan }); });
router.post('/call/BurnReconstructionTiming', (req, res) => { const r = Engine.BurnReconstructionTiming(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'BurnReconstructionTiming', plan: r.plan }); });
router.post('/call/CleftLipRepairTiming', (req, res) => { const r = Engine.CleftLipRepairTiming(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'CleftLipRepairTiming', plan: r.plan }); });
router.post('/call/CleftPalateRepair', (req, res) => { const r = Engine.CleftPalateRepair(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'CleftPalateRepair', plan: r.plan }); });
router.post('/call/CraniosynostosisSurgery', (req, res) => { const r = Engine.CraniosynostosisSurgery(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'CraniosynostosisSurgery', plan: r.plan }); });
router.post('/call/HandReplantationDecision', (req, res) => { const r = Engine.HandReplantationDecision(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'HandReplantationDecision', plan: r.plan }); });
router.post('/call/MicrosurgeryFreeFlap', (req, res) => { const r = Engine.MicrosurgeryFreeFlap(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'MicrosurgeryFreeFlap', plan: r.plan }); });
router.post('/call/ScarRevisionIndication', (req, res) => { const r = Engine.ScarRevisionIndication(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'ScarRevisionIndication', plan: r.plan }); });
router.post('/call/SkinCancerReconstruction', (req, res) => { const r = Engine.SkinCancerReconstruction(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'SkinCancerReconstruction', plan: r.plan }); });
router.post('/call/GenderAffirmingSurgery', (req, res) => { const r = Engine.GenderAffirmingSurgery(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'GenderAffirmingSurgery', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
