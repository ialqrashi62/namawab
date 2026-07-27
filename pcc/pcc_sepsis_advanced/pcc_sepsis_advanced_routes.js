// P3-DM pcc_sepsis_advanced_routes v3.77.0
// P3-DM: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_sepsis_advanced_engine.js');
const VER = '3.77.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_sepsis_advanced', label: 'PCC Sepsis Advanced', functions: Object.keys(Engine) });
});

router.post('/call/SepsisRecognition', (req, res) => { const r = Engine.SepsisRecognition(req.body || {}); res.json({ version: VER, module: 'pcc_sepsis_advanced', function: 'SepsisRecognition', plan: r.plan }); });
router.post('/call/LactateGuidedResuscitation', (req, res) => { const r = Engine.LactateGuidedResuscitation(req.body || {}); res.json({ version: VER, module: 'pcc_sepsis_advanced', function: 'LactateGuidedResuscitation', plan: r.plan }); });
router.post('/call/FluidResponsiveness', (req, res) => { const r = Engine.FluidResponsiveness(req.body || {}); res.json({ version: VER, module: 'pcc_sepsis_advanced', function: 'FluidResponsiveness', plan: r.plan }); });
router.post('/call/VasopressorSelection', (req, res) => { const r = Engine.VasopressorSelection(req.body || {}); res.json({ version: VER, module: 'pcc_sepsis_advanced', function: 'VasopressorSelection', plan: r.plan }); });
router.post('/call/CorticosteroidSepsis', (req, res) => { const r = Engine.CorticosteroidSepsis(req.body || {}); res.json({ version: VER, module: 'pcc_sepsis_advanced', function: 'CorticosteroidSepsis', plan: r.plan }); });
router.post('/call/SourceControlPlan', (req, res) => { const r = Engine.SourceControlPlan(req.body || {}); res.json({ version: VER, module: 'pcc_sepsis_advanced', function: 'SourceControlPlan', plan: r.plan }); });
router.post('/call/EndOrganPerfusion', (req, res) => { const r = Engine.EndOrganPerfusion(req.body || {}); res.json({ version: VER, module: 'pcc_sepsis_advanced', function: 'EndOrganPerfusion', plan: r.plan }); });
router.post('/call/SepsisBundleCompliance', (req, res) => { const r = Engine.SepsisBundleCompliance(req.body || {}); res.json({ version: VER, module: 'pcc_sepsis_advanced', function: 'SepsisBundleCompliance', plan: r.plan }); });
router.post('/call/PostSepsisFollowUp', (req, res) => { const r = Engine.PostSepsisFollowUp(req.body || {}); res.json({ version: VER, module: 'pcc_sepsis_advanced', function: 'PostSepsisFollowUp', plan: r.plan }); });
router.post('/call/SepsisReadmissionRisk', (req, res) => { const r = Engine.SepsisReadmissionRisk(req.body || {}); res.json({ version: VER, module: 'pcc_sepsis_advanced', function: 'SepsisReadmissionRisk', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_sepsis_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
