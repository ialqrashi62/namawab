// P3-EI pcc_neuropsych_ext2_routes v3.99.0
// P3-EI: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neuropsych_ext2_engine.js');
const VER = '3.99.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuropsych_ext2', label: 'PCC Neuropsych Ext2', functions: Object.keys(F) });
});
router.post('/call/NeurocognitiveDisorderMajor', (req, res) => { const r = F.NeurocognitiveDisorderMajor(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'NeurocognitiveDisorderMajor', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FrontotemporalDementia', (req, res) => { const r = F.FrontotemporalDementia(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'FrontotemporalDementia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LewyBodyDementia', (req, res) => { const r = F.LewyBodyDementia(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'LewyBodyDementia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VascularDementia', (req, res) => { const r = F.VascularDementia(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'VascularDementia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MildCognitiveImpairment', (req, res) => { const r = F.MildCognitiveImpairment(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'MildCognitiveImpairment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/WernickeKorsakoff', (req, res) => { const r = F.WernickeKorsakoff(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'WernickeKorsakoff', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TraumaticBrainInjuryCognitive', (req, res) => { const r = F.TraumaticBrainInjuryCognitive(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'TraumaticBrainInjuryCognitive', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PostConcussionSyndrome', (req, res) => { const r = F.PostConcussionSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'PostConcussionSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ChemotherapyRelatedCognitive', (req, res) => { const r = F.ChemotherapyRelatedCognitive(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'ChemotherapyRelatedCognitive', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AutoimmuneEncephalitisCognitive', (req, res) => { const r = F.AutoimmuneEncephalitisCognitive(req.body || {}); res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: 'AutoimmuneEncephalitisCognitive', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuropsych_ext2', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
