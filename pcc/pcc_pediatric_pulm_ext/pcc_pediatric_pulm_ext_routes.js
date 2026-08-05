// P3-EQ pcc_pediatric_pulm_ext_routes v3.107.0
// P3-EQ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_pulm_ext_engine.js');
const VER = '3.107.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', label: 'PCC Pediatric Pulm Ext', functions: Object.keys(F) });
});
router.post('/call/PediatricBronchopulmonaryDysplasia', (req, res) => { const r = F.PediatricBronchopulmonaryDysplasia(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricBronchopulmonaryDysplasia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPulmonaryHypertensionExt', (req, res) => { const r = F.PediatricPulmonaryHypertensionExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricPulmonaryHypertensionExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricInterstitialLungDisease', (req, res) => { const r = F.PediatricInterstitialLungDisease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricInterstitialLungDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricBronchiectasis', (req, res) => { const r = F.PediatricBronchiectasis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricBronchiectasis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPlasticBronchitis', (req, res) => { const r = F.PediatricPlasticBronchitis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricPlasticBronchitis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPulmonaryAlveolarProteinosis', (req, res) => { const r = F.PediatricPulmonaryAlveolarProteinosis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricPulmonaryAlveolarProteinosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricSurfactantDysfunction', (req, res) => { const r = F.PediatricSurfactantDysfunction(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricSurfactantDysfunction', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPulmonaryHemosiderosis', (req, res) => { const r = F.PediatricPulmonaryHemosiderosis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricPulmonaryHemosiderosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricChILD', (req, res) => { const r = F.PediatricChILD(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricChILD', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricLungTransplant', (req, res) => { const r = F.PediatricLungTransplant(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricLungTransplant', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
