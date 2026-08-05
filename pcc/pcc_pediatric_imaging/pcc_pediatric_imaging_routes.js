// P3-EL pcc_pediatric_imaging_routes v3.102.0
// P3-EL: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_imaging_engine.js');
const VER = '3.102.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_imaging', label: 'PCC Pediatric Imaging', functions: Object.keys(F) });
});
router.post('/call/PediatricBrainMRI', (req, res) => { const r = F.PediatricBrainMRI(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_imaging', function: 'PediatricBrainMRI', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCTHead', (req, res) => { const r = F.PediatricCTHead(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_imaging', function: 'PediatricCTHead', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricChestImaging', (req, res) => { const r = F.PediatricChestImaging(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_imaging', function: 'PediatricChestImaging', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricAbdomenImaging', (req, res) => { const r = F.PediatricAbdomenImaging(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_imaging', function: 'PediatricAbdomenImaging', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricSpineImaging', (req, res) => { const r = F.PediatricSpineImaging(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_imaging', function: 'PediatricSpineImaging', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricMusculoskeletalImaging', (req, res) => { const r = F.PediatricMusculoskeletalImaging(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_imaging', function: 'PediatricMusculoskeletalImaging', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCardiacImaging', (req, res) => { const r = F.PediatricCardiacImaging(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_imaging', function: 'PediatricCardiacImaging', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricFetalImaging', (req, res) => { const r = F.PediatricFetalImaging(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_imaging', function: 'PediatricFetalImaging', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricUltrasound', (req, res) => { const r = F.PediatricUltrasound(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_imaging', function: 'PediatricUltrasound', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricNuclearMedicine', (req, res) => { const r = F.PediatricNuclearMedicine(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_imaging', function: 'PediatricNuclearMedicine', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_imaging', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
