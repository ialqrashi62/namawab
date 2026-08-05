// P3-EN pcc_pediatric_icu_ext_routes v3.104.0
// P3-EN: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_icu_ext_engine.js');
const VER = '3.104.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_icu_ext', label: 'PCC Pediatric ICU Ext', functions: Object.keys(F) });
});
router.post('/call/PediatricShock', (req, res) => { const r = F.PediatricShock(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricShock', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricARDS', (req, res) => { const r = F.PediatricARDS(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricARDS', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricSepsisBundle', (req, res) => { const r = F.PediatricSepsisBundle(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricSepsisBundle', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricStatusEpilepticus', (req, res) => { const r = F.PediatricStatusEpilepticus(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricStatusEpilepticus', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHypertensiveEmergency', (req, res) => { const r = F.PediatricHypertensiveEmergency(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricHypertensiveEmergency', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricDKA', (req, res) => { const r = F.PediatricDKA(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricDKA', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricTraumaResuscitation', (req, res) => { const r = F.PediatricTraumaResuscitation(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricTraumaResuscitation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricBurnMgmt', (req, res) => { const r = F.PediatricBurnMgmt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricBurnMgmt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricToxicology', (req, res) => { const r = F.PediatricToxicology(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricToxicology', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPostCardiacArrest', (req, res) => { const r = F.PediatricPostCardiacArrest(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricPostCardiacArrest', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
