// P3-EJ pcc_pediatric_derm_ext_routes v3.100.0
// P3-EJ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_derm_ext_engine.js');
const VER = '3.100.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_derm_ext', label: 'PCC Pediatric Derm Ext', functions: Object.keys(Engine) });
});
router.post('/call/PediatricEczema', (req, res) => { const r = Engine.PediatricEczema(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricEczema', plan: r.plan }); });
router.post('/call/PediatricPsoriasis', (req, res) => { const r = Engine.PediatricPsoriasis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricPsoriasis', plan: r.plan }); });
router.post('/call/PediatricAcne', (req, res) => { const r = Engine.PediatricAcne(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricAcne', plan: r.plan }); });
router.post('/call/PediatricHemangioma', (req, res) => { const r = Engine.PediatricHemangioma(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricHemangioma', plan: r.plan }); });
router.post('/call/PediatricMolluscum', (req, res) => { const r = Engine.PediatricMolluscum(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricMolluscum', plan: r.plan }); });
router.post('/call/PediatricWarts', (req, res) => { const r = Engine.PediatricWarts(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricWarts', plan: r.plan }); });
router.post('/call/PediatricBirthmarks', (req, res) => { const r = Engine.PediatricBirthmarks(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricBirthmarks', plan: r.plan }); });
router.post('/call/PediatricDrugRash', (req, res) => { const r = Engine.PediatricDrugRash(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricDrugRash', plan: r.plan }); });
router.post('/call/PediatricHairDisorders', (req, res) => { const r = Engine.PediatricHairDisorders(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricHairDisorders', plan: r.plan }); });
router.post('/call/PediatricNailDisorders', (req, res) => { const r = Engine.PediatricNailDisorders(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricNailDisorders', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
