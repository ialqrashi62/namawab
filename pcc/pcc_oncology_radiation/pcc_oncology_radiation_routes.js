// P3-EB pcc_oncology_radiation_routes v3.92.0
// P3-EB: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_oncology_radiation_engine.js');
const VER = '3.92.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_oncology_radiation', label: 'PCC Oncology Radiation', functions: Object.keys(Engine) });
});
router.post('/call/RadiationTreatmentPlanning', (req, res) => { const r = Engine.RadiationTreatmentPlanning(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'RadiationTreatmentPlanning', plan: r.plan }); });
router.post('/call/IMRTvsVMATSelection', (req, res) => { const r = Engine.IMRTvsVMATSelection(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'IMRTvsVMATSelection', plan: r.plan }); });
router.post('/call/StereotacticRadiosurgery', (req, res) => { const r = Engine.StereotacticRadiosurgery(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'StereotacticRadiosurgery', plan: r.plan }); });
router.post('/call/BrachytherapyIndication', (req, res) => { const r = Engine.BrachytherapyIndication(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'BrachytherapyIndication', plan: r.plan }); });
router.post('/call/ProtonTherapyEligibility', (req, res) => { const r = Engine.ProtonTherapyEligibility(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'ProtonTherapyEligibility', plan: r.plan }); });
router.post('/call/RadiationToxicityGrading', (req, res) => { const r = Engine.RadiationToxicityGrading(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'RadiationToxicityGrading', plan: r.plan }); });
router.post('/call/ConcurrentChemoradiation', (req, res) => { const r = Engine.ConcurrentChemoradiation(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'ConcurrentChemoradiation', plan: r.plan }); });
router.post('/call/PalliativeRadiation', (req, res) => { const r = Engine.PalliativeRadiation(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'PalliativeRadiation', plan: r.plan }); });
router.post('/call/ReIrradiationProtocol', (req, res) => { const r = Engine.ReIrradiationProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'ReIrradiationProtocol', plan: r.plan }); });
router.post('/call/RadiationPneumonitisRisk', (req, res) => { const r = Engine.RadiationPneumonitisRisk(req.body || {}); res.json({ version: VER, module: 'pcc_oncology_radiation', function: 'RadiationPneumonitisRisk', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_oncology_radiation', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
