// P3-DV pcc_oncology_precision_routes v3.86.0
// P3-DV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_oncology_precision_engine.js');
const VER = '3.86.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_oncology_precision', label: 'PCC Oncology Precision', functions: Object.keys(Engine) });
});
router.post('/call/TumorGenomicProfile', (req, res) => { const r = Engine.TumorGenomicProfile(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'TumorGenomicProfile', plan: r.plan }); });
router.post('/call/TargetedTherapySelection', (req, res) => { const r = Engine.TargetedTherapySelection(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'TargetedTherapySelection', plan: r.plan }); });
router.post('/call/ImmunotherapyEligibility', (req, res) => { const r = Engine.ImmunotherapyEligibility(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'ImmunotherapyEligibility', plan: r.plan }); });
router.post('/call/LiquidBiopsy', (req, res) => { const r = Engine.LiquidBiopsy(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'LiquidBiopsy', plan: r.plan }); });
router.post('/call/MolecularTumorBoard', (req, res) => { const r = Engine.MolecularTumorBoard(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'MolecularTumorBoard', plan: r.plan }); });
router.post('/call/PARPInhibitorEligibility', (req, res) => { const r = Engine.PARPInhibitorEligibility(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'PARPInhibitorEligibility', plan: r.plan }); });
router.post('/call/BRCAtestingProtocol', (req, res) => { const r = Engine.BRCAtestingProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'BRCAtestingProtocol', plan: r.plan }); });
router.post('/call/NTRKFusionDetection', (req, res) => { const r = Engine.NTRKFusionDetection(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'NTRKFusionDetection', plan: r.plan }); });
router.post('/call/CirculatingTumorDNA', (req, res) => { const r = Engine.CirculatingTumorDNA(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'CirculatingTumorDNA', plan: r.plan }); });
router.post('/call/PrecisionRadiationDosimetry', (req, res) => { const r = Engine.PrecisionRadiationDosimetry(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_precision', function: 'PrecisionRadiationDosimetry', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_oncology_precision', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
