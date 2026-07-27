// P3-EC pcc_pediatric_cardiology_routes v3.93.0
// P3-EC: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_cardiology_engine.js');
const VER = '3.93.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_cardiology', label: 'PCC Pediatric Cardiology', functions: Object.keys(Engine) });
});
router.post('/call/CongenitalHeartDiseaseAssessment', (req, res) => { const r = Engine.CongenitalHeartDiseaseAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'CongenitalHeartDiseaseAssessment', plan: r.plan }); });
router.post('/call/PediatricECGInterpretation', (req, res) => { const r = Engine.PediatricECGInterpretation(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'PediatricECGInterpretation', plan: r.plan }); });
router.post('/call/KawasakiDiseaseManagement', (req, res) => { const r = Engine.KawasakiDiseaseManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'KawasakiDiseaseManagement', plan: r.plan }); });
router.post('/call/PediatricEchocardiography', (req, res) => { const r = Engine.PediatricEchocardiography(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'PediatricEchocardiography', plan: r.plan }); });
router.post('/call/PediatricHeartFailure', (req, res) => { const r = Engine.PediatricHeartFailure(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'PediatricHeartFailure', plan: r.plan }); });
router.post('/call/TetralogyOfFallot', (req, res) => { const r = Engine.TetralogyOfFallot(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'TetralogyOfFallot', plan: r.plan }); });
router.post('/call/VSDManagement', (req, res) => { const r = Engine.VSDManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'VSDManagement', plan: r.plan }); });
router.post('/call/AtrialSeptalDefectClosure', (req, res) => { const r = Engine.AtrialSeptalDefectClosure(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'AtrialSeptalDefectClosure', plan: r.plan }); });
router.post('/call/PediatricArrhythmia', (req, res) => { const r = Engine.PediatricArrhythmia(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'PediatricArrhythmia', plan: r.plan }); });
router.post('/call/FontanCirculationManagement', (req, res) => { const r = Engine.FontanCirculationManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'FontanCirculationManagement', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
