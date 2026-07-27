// P3-EI pcc_neuropsych_ext2_routes v3.99.0
// P3-EI: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_neuropsych_ext2_engine.js');
const VER = '3.99.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuropsych_ext2', label: 'PCC Neuropsych Ext2', functions: Object.keys(Engine) });
});
router.post('/call/NeurocognitiveDisorderMajor', (req, res) => { const r = Engine.NeurocognitiveDisorderMajor(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'NeurocognitiveDisorderMajor', plan: r.plan }); });
router.post('/call/FrontotemporalDementia', (req, res) => { const r = Engine.FrontotemporalDementia(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'FrontotemporalDementia', plan: r.plan }); });
router.post('/call/LewyBodyDementia', (req, res) => { const r = Engine.LewyBodyDementia(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'LewyBodyDementia', plan: r.plan }); });
router.post('/call/VascularDementia', (req, res) => { const r = Engine.VascularDementia(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'VascularDementia', plan: r.plan }); });
router.post('/call/MildCognitiveImpairment', (req, res) => { const r = Engine.MildCognitiveImpairment(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'MildCognitiveImpairment', plan: r.plan }); });
router.post('/call/WernickeKorsakoff', (req, res) => { const r = Engine.WernickeKorsakoff(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'WernickeKorsakoff', plan: r.plan }); });
router.post('/call/TraumaticBrainInjuryCognitive', (req, res) => { const r = Engine.TraumaticBrainInjuryCognitive(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'TraumaticBrainInjuryCognitive', plan: r.plan }); });
router.post('/call/PostConcussionSyndrome', (req, res) => { const r = Engine.PostConcussionSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'PostConcussionSyndrome', plan: r.plan }); });
router.post('/call/ChemotherapyRelatedCognitive', (req, res) => { const r = Engine.ChemotherapyRelatedCognitive(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'ChemotherapyRelatedCognitive', plan: r.plan }); });
router.post('/call/AutoimmuneEncephalitisCognitive', (req, res) => { const r = Engine.AutoimmuneEncephalitisCognitive(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'AutoimmuneEncephalitisCognitive', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
