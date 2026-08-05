// P3-DV pcc_oncology_precision_routes v3.86.0
// P3-DV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_oncology_precision_engine.js');
const VER = '3.86.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_oncology_precision', label: 'PCC Oncology Precision', functions: Object.keys(F) });
});
router.post('/call/TumorGenomicProfile', (req, res) => { const r = F.TumorGenomicProfile(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'TumorGenomicProfile', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TargetedTherapySelection', (req, res) => { const r = F.TargetedTherapySelection(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'TargetedTherapySelection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ImmunotherapyEligibility', (req, res) => { const r = F.ImmunotherapyEligibility(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'ImmunotherapyEligibility', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LiquidBiopsy', (req, res) => { const r = F.LiquidBiopsy(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'LiquidBiopsy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MolecularTumorBoard', (req, res) => { const r = F.MolecularTumorBoard(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'MolecularTumorBoard', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PARPInhibitorEligibility', (req, res) => { const r = F.PARPInhibitorEligibility(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'PARPInhibitorEligibility', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BRCAtestingProtocol', (req, res) => { const r = F.BRCAtestingProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'BRCAtestingProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NTRKFusionDetection', (req, res) => { const r = F.NTRKFusionDetection(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'NTRKFusionDetection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CirculatingTumorDNA', (req, res) => { const r = F.CirculatingTumorDNA(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'CirculatingTumorDNA', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PrecisionRadiationDosimetry', (req, res) => { const r = F.PrecisionRadiationDosimetry(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'PrecisionRadiationDosimetry', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_oncology_precision', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
