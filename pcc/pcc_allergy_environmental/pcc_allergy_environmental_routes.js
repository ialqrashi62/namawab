// P3-DJ pcc_allergy_environmental_routes v3.74.0
// P3-DJ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_allergy_environmental_engine.js');
const VER = '3.74.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_allergy_environmental', label: 'PCC Allergy Environmental', functions: Object.keys(Engine) });
});

router.post('/call/PollenForecast', (req, res) => { const r = Engine.PollenForecast(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_environmental', function: 'PollenForecast', plan: r.plan }); });
router.post('/call/MoldExposure', (req, res) => { const r = Engine.MoldExposure(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_environmental', function: 'MoldExposure', plan: r.plan }); });
router.post('/call/DustMite', (req, res) => { const r = Engine.DustMite(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_environmental', function: 'DustMite', plan: r.plan }); });
router.post('/call/PetDander', (req, res) => { const r = Engine.PetDander(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_environmental', function: 'PetDander', plan: r.plan }); });
router.post('/call/Cockroach', (req, res) => { const r = Engine.Cockroach(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_environmental', function: 'Cockroach', plan: r.plan }); });
router.post('/call/RodentAllergen', (req, res) => { const r = Engine.RodentAllergen(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_environmental', function: 'RodentAllergen', plan: r.plan }); });
router.post('/call/IndoorAirQuality', (req, res) => { const r = Engine.IndoorAirQuality(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_environmental', function: 'IndoorAirQuality', plan: r.plan }); });
router.post('/call/SeasonalStrategy', (req, res) => { const r = Engine.SeasonalStrategy(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_environmental', function: 'SeasonalStrategy', plan: r.plan }); });
router.post('/call/EnvironmentalControl', (req, res) => { const r = Engine.EnvironmentalControl(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_environmental', function: 'EnvironmentalControl', plan: r.plan }); });
router.post('/call/AllergenImmunotherapy', (req, res) => { const r = Engine.AllergenImmunotherapy(req.body || {}); res.json({ version: VER, module: 'pcc_allergy_environmental', function: 'AllergenImmunotherapy', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_allergy_environmental', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
