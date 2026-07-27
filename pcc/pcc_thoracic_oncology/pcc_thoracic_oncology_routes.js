// P3-DZ pcc_thoracic_oncology_routes v3.90.0
// P3-DZ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_thoracic_oncology_engine.js');
const VER = '3.90.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_thoracic_oncology', label: 'PCC Thoracic Oncology', functions: Object.keys(Engine) });
});
router.post('/call/LungCancerStaging', (req, res) => { const r = Engine.LungCancerStaging(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'LungCancerStaging', plan: r.plan }); });
router.post('/call/MediastinalMassWorkup', (req, res) => { const r = Engine.MediastinalMassWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'MediastinalMassWorkup', plan: r.plan }); });
router.post('/call/MesotheliomaManagement', (req, res) => { const r = Engine.MesotheliomaManagement(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'MesotheliomaManagement', plan: r.plan }); });
router.post('/call/SuperiorSulcusTumor', (req, res) => { const r = Engine.SuperiorSulcusTumor(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'SuperiorSulcusTumor', plan: r.plan }); });
router.post('/call/TrachealTumorResection', (req, res) => { const r = Engine.TrachealTumorResection(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'TrachealTumorResection', plan: r.plan }); });
router.post('/call/ChestWallTumorReconstruction', (req, res) => { const r = Engine.ChestWallTumorReconstruction(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'ChestWallTumorReconstruction', plan: r.plan }); });
router.post('/call/PancoastTumorProtocol', (req, res) => { const r = Engine.PancoastTumorProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'PancoastTumorProtocol', plan: r.plan }); });
router.post('/call/EndobronchialTumorStent', (req, res) => { const r = Engine.EndobronchialTumorStent(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'EndobronchialTumorStent', plan: r.plan }); });
router.post('/call/ThymomaStaging', (req, res) => { const r = Engine.ThymomaStaging(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'ThymomaStaging', plan: r.plan }); });
router.post('/call/LungMetastasectomy', (req, res) => { const r = Engine.LungMetastasectomy(req.body || {}); res.json({ version: VER, module: 'pcc_thoracic_oncology', function: 'LungMetastasectomy', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_thoracic_oncology', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
