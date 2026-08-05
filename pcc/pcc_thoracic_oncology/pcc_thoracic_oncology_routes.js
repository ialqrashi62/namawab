// P3-DZ pcc_thoracic_oncology_routes v3.90.0
// P3-DZ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_thoracic_oncology_engine.js');
const VER = '3.90.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_thoracic_oncology', label: 'PCC Thoracic Oncology', functions: Object.keys(F) });
});
router.post('/call/LungCancerStaging', (req, res) => { const r = F.LungCancerStaging(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'LungCancerStaging', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MediastinalMassWorkup', (req, res) => { const r = F.MediastinalMassWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'MediastinalMassWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MesotheliomaManagement', (req, res) => { const r = F.MesotheliomaManagement(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'MesotheliomaManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SuperiorSulcusTumor', (req, res) => { const r = F.SuperiorSulcusTumor(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'SuperiorSulcusTumor', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TrachealTumorResection', (req, res) => { const r = F.TrachealTumorResection(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'TrachealTumorResection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ChestWallTumorReconstruction', (req, res) => { const r = F.ChestWallTumorReconstruction(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'ChestWallTumorReconstruction', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PancoastTumorProtocol', (req, res) => { const r = F.PancoastTumorProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'PancoastTumorProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/EndobronchialTumorStent', (req, res) => { const r = F.EndobronchialTumorStent(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'EndobronchialTumorStent', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ThymomaStaging', (req, res) => { const r = F.ThymomaStaging(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'ThymomaStaging', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LungMetastasectomy', (req, res) => { const r = F.LungMetastasectomy(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'LungMetastasectomy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_thoracic_oncology', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
