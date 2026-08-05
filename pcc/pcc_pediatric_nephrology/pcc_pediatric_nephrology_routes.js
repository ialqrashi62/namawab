// P3-EF pcc_pediatric_nephrology_routes v3.96.0
// P3-EF: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_nephrology_engine.js');
const VER = '3.96.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_nephrology', label: 'PCC Pediatric Nephrology', functions: Object.keys(F) });
});
router.post('/call/NephroticSyndromeChild', (req, res) => { const r = F.NephroticSyndromeChild(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_nephrology', function: 'NephroticSyndromeChild', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricUTIWorkup', (req, res) => { const r = F.PediatricUTIWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_nephrology', function: 'PediatricUTIWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HemolyticUremicSyndrome', (req, res) => { const r = F.HemolyticUremicSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_nephrology', function: 'HemolyticUremicSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ChronicKidneyDiseasePediatric', (req, res) => { const r = F.ChronicKidneyDiseasePediatric(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_nephrology', function: 'ChronicKidneyDiseasePediatric', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RenalTubularAcidosis', (req, res) => { const r = F.RenalTubularAcidosis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_nephrology', function: 'RenalTubularAcidosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PolycysticKidneyDisease', (req, res) => { const r = F.PolycysticKidneyDisease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_nephrology', function: 'PolycysticKidneyDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GlomerulonephritisPediatric', (req, res) => { const r = F.GlomerulonephritisPediatric(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_nephrology', function: 'GlomerulonephritisPediatric', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HypertensionPediatric', (req, res) => { const r = F.HypertensionPediatric(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_nephrology', function: 'HypertensionPediatric', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DialysisPediatric', (req, res) => { const r = F.DialysisPediatric(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_nephrology', function: 'DialysisPediatric', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RenalTransplantPediatric', (req, res) => { const r = F.RenalTransplantPediatric(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_nephrology', function: 'RenalTransplantPediatric', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_nephrology', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
