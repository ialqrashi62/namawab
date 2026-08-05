// P3-EC pcc_pediatric_cardiology_routes v3.93.0
// P3-EC: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_cardiology_engine.js');
const VER = '3.93.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_cardiology', label: 'PCC Pediatric Cardiology', functions: Object.keys(F) });
});
router.post('/call/CongenitalHeartDiseaseAssessment', (req, res) => { const r = F.CongenitalHeartDiseaseAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'CongenitalHeartDiseaseAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricECGInterpretation', (req, res) => { const r = F.PediatricECGInterpretation(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'PediatricECGInterpretation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/KawasakiDiseaseManagement', (req, res) => { const r = F.KawasakiDiseaseManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'KawasakiDiseaseManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricEchocardiography', (req, res) => { const r = F.PediatricEchocardiography(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'PediatricEchocardiography', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHeartFailure', (req, res) => { const r = F.PediatricHeartFailure(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'PediatricHeartFailure', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TetralogyOfFallot', (req, res) => { const r = F.TetralogyOfFallot(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'TetralogyOfFallot', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VSDManagement', (req, res) => { const r = F.VSDManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'VSDManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AtrialSeptalDefectClosure', (req, res) => { const r = F.AtrialSeptalDefectClosure(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'AtrialSeptalDefectClosure', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricArrhythmia', (req, res) => { const r = F.PediatricArrhythmia(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'PediatricArrhythmia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FontanCirculationManagement', (req, res) => { const r = F.FontanCirculationManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: 'FontanCirculationManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_cardiology', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
