// P3-EB pcc_plastic_surgery_ext_routes v3.92.0
// P3-EB: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_plastic_surgery_ext_engine.js');
const VER = '3.92.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_plastic_surgery_ext', label: 'PCC Plastic Surgery Ext', functions: Object.keys(F) });
});
router.post('/call/BreastReconstructionSelection', (req, res) => { const r = F.BreastReconstructionSelection(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'BreastReconstructionSelection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BurnReconstructionTiming', (req, res) => { const r = F.BurnReconstructionTiming(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'BurnReconstructionTiming', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CleftLipRepairTiming', (req, res) => { const r = F.CleftLipRepairTiming(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'CleftLipRepairTiming', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CleftPalateRepair', (req, res) => { const r = F.CleftPalateRepair(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'CleftPalateRepair', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CraniosynostosisSurgery', (req, res) => { const r = F.CraniosynostosisSurgery(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'CraniosynostosisSurgery', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HandReplantationDecision', (req, res) => { const r = F.HandReplantationDecision(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'HandReplantationDecision', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MicrosurgeryFreeFlap', (req, res) => { const r = F.MicrosurgeryFreeFlap(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'MicrosurgeryFreeFlap', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ScarRevisionIndication', (req, res) => { const r = F.ScarRevisionIndication(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'ScarRevisionIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SkinCancerReconstruction', (req, res) => { const r = F.SkinCancerReconstruction(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'SkinCancerReconstruction', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GenderAffirmingSurgery', (req, res) => { const r = F.GenderAffirmingSurgery(req.body || {}); res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: 'GenderAffirmingSurgery', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_plastic_surgery_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
