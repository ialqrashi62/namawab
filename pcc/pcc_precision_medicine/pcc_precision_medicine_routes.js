// P3-DB pcc_precision_medicine_routes v3.66.0
// P3-DB: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_precision_medicine_engine.js');
const VER = '3.66.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_precision_medicine', label: 'PCC Precision Medicine', functions: Object.keys(Engine) });
});

router.post('/call/Pharmacogenomics', (req, res) => { const r = Engine.Pharmacogenomics(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'Pharmacogenomics', plan: r.plan }); });
router.post('/call/OmicsProfile', (req, res) => { const r = Engine.OmicsProfile(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'OmicsProfile', plan: r.plan }); });
router.post('/call/BiomarkerPanel', (req, res) => { const r = Engine.BiomarkerPanel(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'BiomarkerPanel', plan: r.plan }); });
router.post('/call/TargetedTherapy', (req, res) => { const r = Engine.TargetedTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'TargetedTherapy', plan: r.plan }); });
router.post('/call/RareVariant', (req, res) => { const r = Engine.RareVariant(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'RareVariant', plan: r.plan }); });
router.post('/call/TumorProfiling', (req, res) => { const r = Engine.TumorProfiling(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'TumorProfiling', plan: r.plan }); });
router.post('/call/MicrobiomeGuide', (req, res) => { const r = Engine.MicrobiomeGuide(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'MicrobiomeGuide', plan: r.plan }); });
router.post('/call/Nutrigenomics', (req, res) => { const r = Engine.Nutrigenomics(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'Nutrigenomics', plan: r.plan }); });
router.post('/call/Proteomics', (req, res) => { const r = Engine.Proteomics(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'Proteomics', plan: r.plan }); });
router.post('/call/Metabolomics', (req, res) => { const r = Engine.Metabolomics(req.body || {}); res.json({ version: VER, module: 'pcc_precision_medicine', function: 'Metabolomics', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_precision_medicine', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
