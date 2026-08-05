// P3-DB pcc_precision_medicine_routes v3.66.0
// P3-DB: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_precision_medicine_engine.js');
const VER = '3.66.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_precision_medicine', label: 'PCC Precision Medicine', functions: Object.keys(F) });
});

router.post('/call/Pharmacogenomics', (req, res) => { const r = F.Pharmacogenomics(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'Pharmacogenomics', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/OmicsProfile', (req, res) => { const r = F.OmicsProfile(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'OmicsProfile', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BiomarkerPanel', (req, res) => { const r = F.BiomarkerPanel(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'BiomarkerPanel', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TargetedTherapy', (req, res) => { const r = F.TargetedTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'TargetedTherapy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RareVariant', (req, res) => { const r = F.RareVariant(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'RareVariant', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TumorProfiling', (req, res) => { const r = F.TumorProfiling(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'TumorProfiling', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MicrobiomeGuide', (req, res) => { const r = F.MicrobiomeGuide(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'MicrobiomeGuide', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Nutrigenomics', (req, res) => { const r = F.Nutrigenomics(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'Nutrigenomics', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Proteomics', (req, res) => { const r = F.Proteomics(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'Proteomics', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Metabolomics', (req, res) => { const r = F.Metabolomics(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'Metabolomics', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_precision_medicine', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
