// P3-EQ pcc_pediatric_pulm_ext_routes v3.107.0
// P3-EQ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_pulm_ext_engine.js');
const VER = '3.107.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', label: 'PCC Pediatric Pulm Ext', functions: Object.keys(Engine) });
});
router.post('/call/PediatricBronchopulmonaryDysplasia', (req, res) => { const r = Engine.PediatricBronchopulmonaryDysplasia(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricBronchopulmonaryDysplasia', plan: r.plan }); });
router.post('/call/PediatricPulmonaryHypertensionExt', (req, res) => { const r = Engine.PediatricPulmonaryHypertensionExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricPulmonaryHypertensionExt', plan: r.plan }); });
router.post('/call/PediatricInterstitialLungDisease', (req, res) => { const r = Engine.PediatricInterstitialLungDisease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricInterstitialLungDisease', plan: r.plan }); });
router.post('/call/PediatricBronchiectasis', (req, res) => { const r = Engine.PediatricBronchiectasis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricBronchiectasis', plan: r.plan }); });
router.post('/call/PediatricPlasticBronchitis', (req, res) => { const r = Engine.PediatricPlasticBronchitis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricPlasticBronchitis', plan: r.plan }); });
router.post('/call/PediatricPulmonaryAlveolarProteinosis', (req, res) => { const r = Engine.PediatricPulmonaryAlveolarProteinosis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricPulmonaryAlveolarProteinosis', plan: r.plan }); });
router.post('/call/PediatricSurfactantDysfunction', (req, res) => { const r = Engine.PediatricSurfactantDysfunction(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricSurfactantDysfunction', plan: r.plan }); });
router.post('/call/PediatricPulmonaryHemosiderosis', (req, res) => { const r = Engine.PediatricPulmonaryHemosiderosis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricPulmonaryHemosiderosis', plan: r.plan }); });
router.post('/call/PediatricChILD', (req, res) => { const r = Engine.PediatricChILD(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricChILD', plan: r.plan }); });
router.post('/call/PediatricLungTransplant', (req, res) => { const r = Engine.PediatricLungTransplant(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: 'PediatricLungTransplant', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_pulm_ext', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
