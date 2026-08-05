// P3-EJ pcc_pediatric_derm_ext_routes v3.100.0
// P3-EJ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_derm_ext_engine.js');
const VER = '3.100.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_derm_ext', label: 'PCC Pediatric Derm Ext', functions: Object.keys(F) });
});
router.post('/call/PediatricEczema', (req, res) => { const r = F.PediatricEczema(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricEczema', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPsoriasis', (req, res) => { const r = F.PediatricPsoriasis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricPsoriasis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricAcne', (req, res) => { const r = F.PediatricAcne(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricAcne', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHemangioma', (req, res) => { const r = F.PediatricHemangioma(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricHemangioma', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricMolluscum', (req, res) => { const r = F.PediatricMolluscum(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricMolluscum', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricWarts', (req, res) => { const r = F.PediatricWarts(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricWarts', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricBirthmarks', (req, res) => { const r = F.PediatricBirthmarks(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricBirthmarks', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricDrugRash', (req, res) => { const r = F.PediatricDrugRash(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricDrugRash', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHairDisorders', (req, res) => { const r = F.PediatricHairDisorders(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricHairDisorders', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricNailDisorders', (req, res) => { const r = F.PediatricNailDisorders(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: 'PediatricNailDisorders', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_derm_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
