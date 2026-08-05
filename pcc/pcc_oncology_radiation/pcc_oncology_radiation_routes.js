// P3-EB pcc_oncology_radiation_routes v3.92.0
// P3-EB: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_oncology_radiation_engine.js');
const VER = '3.92.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_oncology_radiation', label: 'PCC Oncology Radiation', functions: Object.keys(F) });
});
router.post('/call/RadiationTreatmentPlanning', (req, res) => { const r = F.RadiationTreatmentPlanning(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'RadiationTreatmentPlanning', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/IMRTvsVMATSelection', (req, res) => { const r = F.IMRTvsVMATSelection(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'IMRTvsVMATSelection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/StereotacticRadiosurgery', (req, res) => { const r = F.StereotacticRadiosurgery(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'StereotacticRadiosurgery', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BrachytherapyIndication', (req, res) => { const r = F.BrachytherapyIndication(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'BrachytherapyIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ProtonTherapyEligibility', (req, res) => { const r = F.ProtonTherapyEligibility(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'ProtonTherapyEligibility', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RadiationToxicityGrading', (req, res) => { const r = F.RadiationToxicityGrading(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'RadiationToxicityGrading', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ConcurrentChemoradiation', (req, res) => { const r = F.ConcurrentChemoradiation(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'ConcurrentChemoradiation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PalliativeRadiation', (req, res) => { const r = F.PalliativeRadiation(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'PalliativeRadiation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ReIrradiationProtocol', (req, res) => { const r = F.ReIrradiationProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'ReIrradiationProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RadiationPneumonitisRisk', (req, res) => { const r = F.RadiationPneumonitisRisk(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'RadiationPneumonitisRisk', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_oncology_radiation', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
